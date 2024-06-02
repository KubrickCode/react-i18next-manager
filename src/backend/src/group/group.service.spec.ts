import { Test, TestingModule } from '@nestjs/testing';
import { DB, DBService, GroupSchema } from 'src/db/db.service';
import { generateUUID } from 'src/common/utils';
import { GroupService } from './group.service';
import { GroupRepository } from './group.repository';
import { TranslationRepository } from 'src/translation/translation.repository';

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
    module = await Test.createTestingModule({
      providers: [
        GroupService,
        GroupRepository,
        DBService,
        TranslationRepository,
      ],
    }).compile();

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
});
