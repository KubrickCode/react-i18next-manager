import { Test, TestingModule } from '@nestjs/testing';
import { DB, DBService } from 'src/db/db.service';
import { generateUUID } from 'src/common/utils';
import { GroupService } from './group.service';
import { groupModuleConfig } from './group.module.config';
import { ConflictException } from '@nestjs/common';
import {
  initialGroups,
  initialLocales,
  initialTranslations,
} from 'src/test/seed.data';
import { faker } from '@faker-js/faker';

describe('GroupService Integration', () => {
  let module: TestingModule;
  let service: GroupService;
  let dbService: DBService;
  let db: DB;

  beforeAll(async () => {
    module = await Test.createTestingModule(groupModuleConfig).compile();

    service = module.get<GroupService>(GroupService);
    dbService = module.get<DBService>(DBService);

    db = await dbService.get();
  });

  beforeEach(async () => {
    db.setState({
      locales: [...initialLocales],
      groups: [...initialGroups],
      translations: [...initialTranslations],
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
    await service.editPosition({ id: groupC.id, parentId: null, position: 0 });

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

    await service.editPosition({
      id: groupA_C.id,
      parentId: groupAId,
      position: 0,
    });

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

  it('groups 삭제 시 해당 그룹을 사용하는 translations도 삭제', async () => {
    // 삭제할 그룹과 이를 사용하는 translations 설정
    const groupIdToDelete = initialGroups[0].id;
    const translationsUsingGroup = initialTranslations.filter(
      (translation) => translation.groupId === groupIdToDelete,
    );

    // 삭제 이전에 translations이 존재하는지 확인
    const existingTranslations = db
      .get('translations')
      .filter((translation) =>
        translationsUsingGroup.map((t) => t.id).includes(translation.id),
      )
      .value();
    expect(existingTranslations).toHaveLength(translationsUsingGroup.length);

    // 그룹 삭제
    await service.delete({ id: groupIdToDelete });

    // 그룹 삭제 이후 translations이 존재하지 않는지 확인
    const remainingTranslations = db
      .get('translations')
      .filter((translation) =>
        translationsUsingGroup.map((t) => t.id).includes(translation.id),
      )
      .value();
    expect(remainingTranslations).toHaveLength(0);
  });

  it('재귀적으로 모든 자식 그룹 및 해당 translations 삭제 확인', async () => {
    const parentGroupId = initialGroups[0].id;
    const childGroupId1 = generateUUID();
    const childGroupId2 = generateUUID();

    const parentGroup = {
      id: parentGroupId,
      parentId: null,
      label: 'parentGroup',
      position: 0,
    };
    const childGroup1 = {
      id: childGroupId1,
      parentId: parentGroupId,
      label: 'childGroup1',
      position: 0,
    };
    const childGroup2 = {
      id: childGroupId2,
      parentId: parentGroupId,
      label: 'childGroup2',
      position: 1,
    };

    const translationForParentGroup = {
      id: generateUUID(),
      groupId: parentGroupId,
      key: faker.word.noun(),
      values: [
        { localeId: initialLocales[0].id, value: faker.word.words() },
        { localeId: initialLocales[1].id, value: faker.word.words() },
      ],
    };
    const translationForChildGroup1 = {
      id: generateUUID(),
      groupId: childGroupId1,
      key: faker.word.noun(),
      values: [
        { localeId: initialLocales[0].id, value: faker.word.words() },
        { localeId: initialLocales[1].id, value: faker.word.words() },
      ],
    };
    const translationForChildGroup2 = {
      id: generateUUID(),
      groupId: childGroupId2,
      key: faker.word.noun(),
      values: [
        { localeId: initialLocales[0].id, value: faker.word.words() },
        { localeId: initialLocales[1].id, value: faker.word.words() },
      ],
    };

    db.setState({
      locales: [...initialLocales],
      groups: [parentGroup, childGroup1, childGroup2],
      translations: [
        translationForParentGroup,
        translationForChildGroup1,
        translationForChildGroup2,
      ],
    }).write();

    // 삭제 이전에 자식 그룹과 translations이 존재하는지 확인
    const existingChildGroups = db
      .get('groups')
      .filter({ parentId: parentGroupId })
      .value();
    expect(existingChildGroups).toHaveLength(2);

    const existingTranslations = db
      .get('translations')
      .filter((translation) =>
        [parentGroupId, childGroupId1, childGroupId2].includes(
          translation.groupId,
        ),
      )
      .value();
    expect(existingTranslations).toHaveLength(3);

    // 그룹 삭제
    await service.delete({ id: parentGroupId });

    // 그룹 삭제 이후 자식 그룹과 translations이 존재하지 않는지 확인
    const remainingGroups = db
      .get('groups')
      .filter({ parentId: parentGroupId })
      .value();
    expect(remainingGroups).toHaveLength(0);

    const remainingTranslations = db
      .get('translations')
      .filter((translation) =>
        [parentGroupId, childGroupId1, childGroupId2].includes(
          translation.groupId,
        ),
      )
      .value();
    expect(remainingTranslations).toHaveLength(0);
  });
});
