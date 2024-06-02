import { Test, TestingModule } from '@nestjs/testing';
import { DB, DBService, GroupSchema } from 'src/db/db.service';
import { generateUUID } from 'src/common/utils';
import { GroupService } from './group.service';
import { groupModuleConfig } from './group.module.config';

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
});
