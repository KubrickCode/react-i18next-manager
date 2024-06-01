import { Test, TestingModule } from '@nestjs/testing';
import { LocaleService } from './locale.service';
import { LocaleRepository } from './locale.repository';
import { DBService } from 'src/db/db.service';
import { generateUUID } from 'src/common/utils';

describe('LocaleService', () => {
  let service: LocaleService;
  let repository: LocaleRepository;

  beforeEach(async () => {
    const mockDBService = {
      get: jest.fn().mockResolvedValue({
        get: jest.fn().mockReturnThis(),
        sortBy: jest.fn().mockReturnThis(),
        value: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocaleService,
        LocaleRepository,
        {
          provide: DBService,
          useValue: mockDBService,
        },
      ],
    }).compile();

    service = module.get<LocaleService>(LocaleService);
    repository = module.get<LocaleRepository>(LocaleRepository);
  });

  it('모든 locales 반환 성공', async () => {
    const locales = [
      { id: generateUUID(), label: 'en', position: 0 },
      { id: generateUUID(), label: 'ko', position: 1 },
    ];

    jest.spyOn(repository, 'findMany').mockResolvedValue(locales);

    const result = await service.getAll();
    expect(result).toEqual({ locales });
  });
});
