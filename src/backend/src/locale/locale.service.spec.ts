import { Test, TestingModule } from '@nestjs/testing';
import { LocaleService } from './locale.service';
import { LocaleRepository } from './locale.repository';
import { DBService } from 'src/db/db.service';
import * as fs from 'fs';
import * as path from 'path';

describe('LocaleService Integration', () => {
  let service: LocaleService;
  let dbService: DBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocaleService, LocaleRepository, DBService],
    }).compile();

    service = module.get<LocaleService>(LocaleService);
    dbService = module.get<DBService>(DBService);

    const db = await dbService.get();
    const testData = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, '../../test/test-db.json'),
        'utf-8',
      ),
    );
    db.setState(testData).write();
  });

  it('모든 locales 반환 성공', async () => {
    const result = await service.getAll();
    expect(result.locales).toEqual([
      { id: '9094373b-d01c-4359-bf18-3cc66a04505b', label: 'en', position: 0 },
      { id: 'c50010a4-7c43-432d-89d2-2cac5e44eee2', label: 'ko', position: 1 },
    ]);
  });

  it('순서가 바뀐 locales를 올바르게 정렬하여 반환', async () => {
    const db = await dbService.get();
    const testData = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, '../../test/test-db.json'),
        'utf-8',
      ),
    );

    // 'ko'와 'en'의 순서를 바꿈
    const modifiedTestData = {
      ...testData,
      locales: [
        {
          id: 'c50010a4-7c43-432d-89d2-2cac5e44eee2',
          label: 'ko',
          position: 1,
        },
        {
          id: '9094373b-d01c-4359-bf18-3cc66a04505b',
          label: 'en',
          position: 0,
        },
      ],
    };
    db.setState(modifiedTestData).write();

    const result = await service.getAll();
    expect(result.locales).toEqual([
      { id: '9094373b-d01c-4359-bf18-3cc66a04505b', label: 'en', position: 0 },
      { id: 'c50010a4-7c43-432d-89d2-2cac5e44eee2', label: 'ko', position: 1 },
    ]);
  });

  it('새로운 locale을 정상적으로 추가', async () => {
    const newLocale = { label: 'fr', position: 2 };

    await service.add(newLocale);

    const db = await dbService.get();
    const locales = db.get('locales').value();

    expect(locales).toContainEqual(expect.objectContaining(newLocale));
  });
});
