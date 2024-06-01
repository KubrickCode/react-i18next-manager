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
});
