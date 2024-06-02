import { Test, TestingModule } from '@nestjs/testing';
import { DB, DBService, GroupSchema } from 'src/db/db.service';
import { generateUUID } from 'src/common/utils';
import { GroupService } from './group.service';
import { groupModuleConfig } from './group.module.config';
import { ConflictException } from '@nestjs/common';

describe('GroupService Integration', () => {
  let module: TestingModule;
  let service: GroupService;
  let dbService: DBService;
  let db: DB;
  const initialParentId = generateUUID();
  const initialGroups: GroupSchema[] = [
    {
      id: initialParentId,
      parentId: null,
      label: 'test1',
      position: 0,
    },
    {
      id: generateUUID(),
      parentId: null,
      label: 'test2',
      position: 1,
    },
    {
      id: generateUUID(),
      parentId: initialParentId,
      label: 'test1-1',
      position: 0,
    },
    {
      id: generateUUID(),
      parentId: initialParentId,
      label: 'test1-2',
      position: 1,
    },
  ];

  beforeAll(async () => {
    module = await Test.createTestingModule(groupModuleConfig).compile();

    service = module.get<GroupService>(GroupService);
    dbService = module.get<DBService>(DBService);

    db = await dbService.get();
  });

  beforeEach(async () => {
    db.setState({
      locales: [],
      groups: [...initialGroups],
      translations: [],
    }).write();
  });

  afterAll(async () => {
    await module.close();
  });

  it('모든 groups 반환 성공', async () => {
    const result = await service.getAll();

    expect(result.groups).toEqual(initialGroups);
  });

  it('group 추가 성공(최상위 그룹)', async () => {
    const newGroup = {
      label: 'test3',
      parentId: null,
    };
    await service.add(newGroup);

    const groups = db.getState().groups;
    expect(groups).toContainEqual(expect.objectContaining(newGroup));
  });

  it('group 추가 성공(1단 부모 그룹)', async () => {
    const newGroup = {
      label: 'test1-3',
      parentId: initialGroups[0].id,
    };
    await service.add(newGroup);

    const groups = db
      .get('groups')
      .filter({ parentId: initialGroups[0].id })
      .value();
    expect(groups).toContainEqual(expect.objectContaining(newGroup));
  });

  it('group 추가 실패(최상위 그룹) - label 충돌', async () => {
    const newGroup = {
      label: 'test1',
      parentId: null,
    };

    expect(service.add(newGroup)).rejects.toThrow(ConflictException);
  });

  it('group 추가 실패(1단 부모 그룹) - label 충돌', async () => {
    const newGroup = {
      label: initialGroups[2].label,
      parentId: initialGroups[0].id,
    };

    expect(service.add(newGroup)).rejects.toThrow(ConflictException);
  });

  it('group label 변경 성공(최상위 그룹)', async () => {
    const group = initialGroups[0];
    const newLabel = 'test1-new';
    await service.editLabel({ id: group.id, newLabel });

    const groups = db.get('groups').value();
    const updatedGroup = groups.find((g) => g.id === group.id);
    expect(updatedGroup.label).toBe(newLabel);
  });

  it('group label 변경 성공(1단 부모 그룹)', async () => {
    const group = initialGroups[2];
    const newLabel = 'test1-1-new';
    await service.editLabel({ id: group.id, newLabel });

    const groups = db.get('groups').value();
    const updatedGroup = groups.find((g) => g.id === group.id);
    expect(updatedGroup.label).toBe(newLabel);
  });

  it('group label 변경 실패(최상위 그룹) - label 충돌', async () => {
    const group = initialGroups[0];
    const newLabel = initialGroups[1].label;

    expect(service.editLabel({ id: group.id, newLabel })).rejects.toThrow(
      ConflictException,
    );
  });

  it('group label 변경 실패(1단 부모 그룹) - label 충돌', async () => {
    const group = initialGroups[2];
    const newLabel = initialGroups[3].label;

    expect(service.editLabel({ id: group.id, newLabel })).rejects.toThrow(
      ConflictException,
    );
  });

  it('group 이동 성공(최상위 그룹)', async () => {
    const groupA = {
      id: generateUUID(),
      label: 'groupA',
      parentId: null,
      position: 0,
    };
    const groupB = {
      id: generateUUID(),
      label: 'groupB',
      parentId: null,
      position: 1,
    };
    const groupC = {
      id: generateUUID(),
      label: 'groupC',
      parentId: null,
      position: 2,
    };

    db.setState({
      locales: [],
      groups: [groupA, groupB, groupC],
      translations: [],
    }).write();

    // groupC를 0번 위치로 이동
    await service.editPosition({ id: groupC.id, position: 0 });

    const groups = db.get('groups').sortBy('position').value();

    expect(groups).toEqual([
      expect.objectContaining({ id: groupC.id, position: 0 }),
      expect.objectContaining({ id: groupA.id, position: 1 }),
      expect.objectContaining({ id: groupB.id, position: 2 }),
    ]);
  });

  it('group 이동 성공(1단 부모 그룹)', async () => {
    const groupAId = generateUUID();
    const groupA = {
      id: groupAId,
      label: 'groupA',
      parentId: null,
      position: 0,
    };
    const groupA_A = {
      id: generateUUID(),
      label: 'groupA_A',
      parentId: groupAId,
      position: 0,
    };
    const groupA_B = {
      id: generateUUID(),
      label: 'groupA_B',
      parentId: groupAId,
      position: 1,
    };
    const groupA_C = {
      id: generateUUID(),
      label: 'groupA_C',
      parentId: groupAId,
      position: 2,
    };

    db.setState({
      locales: [],
      groups: [groupA, groupA_A, groupA_B, groupA_C],
      translations: [],
    }).write();

    await service.editPosition({ id: groupA_C.id, position: 0 });

    const groups = db
      .get('groups')
      .filter({ parentId: groupAId })
      .sortBy('position')
      .value();

    expect(groups).toEqual([
      expect.objectContaining({ id: groupA_C.id, position: 0 }),
      expect.objectContaining({ id: groupA_A.id, position: 1 }),
      expect.objectContaining({ id: groupA_B.id, position: 2 }),
    ]);
  });

  it('group 삭제 성공(최상위 그룹)', async () => {
    const group = initialGroups[0];
    await service.delete({ id: group.id });

    const groups = db.get('groups').value();
    expect(groups).not.toContainEqual(expect.objectContaining(group));

    // 자식 그룹들도 모두 삭제되었는지 확인
    const childGroups = groups.filter((g) => g.parentId === group.id);
    expect(childGroups).toHaveLength(0);
  });
});
