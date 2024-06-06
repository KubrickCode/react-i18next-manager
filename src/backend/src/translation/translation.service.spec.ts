import { Test, TestingModule } from '@nestjs/testing';
import { DB, DBService } from 'src/db/db.service';
import { TranslationService } from './translation.service';
import { translationModuleConfig } from './translation.module.config';
import {
  initialGroups,
  initialLocales,
  initialTranslations,
} from 'src/test/seed.data';
import { faker } from '@faker-js/faker';
import { ConflictException } from '@nestjs/common';

describe('TranslationService Integration', () => {
  let module: TestingModule;
  let service: TranslationService;
  let dbService: DBService;
  let db: DB;

  beforeAll(async () => {
    module = await Test.createTestingModule(translationModuleConfig).compile();

    service = module.get<TranslationService>(TranslationService);
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

  it('모든 translations 반환 성공', async () => {
    const result = await service.getAll({ groupId: initialGroups[0].id });

    expect(result.translations).toEqual(
      initialTranslations.filter(
        (translation) => translation.groupId === initialGroups[0].id,
      ),
    );
  });

  it('translation 추가 성공', async () => {
    const newKey = faker.word.noun();
    const newValues = [
      { localeId: initialLocales[0].id, value: faker.word.words() },
      { localeId: initialLocales[1].id, value: faker.word.words() },
    ];

    await service.add({
      groupId: initialGroups[0].id,
      key: newKey,
      values: newValues,
    });

    const result = db
      .get('translations')
      .filter((translation) => translation.groupId === initialGroups[0].id)
      .value();

    expect(result).toContainEqual(
      expect.objectContaining({
        key: newKey,
        values: newValues,
      }),
    );
  });

  it('translation 추가 실패 - 이미 존재하는 key', async () => {
    const key = initialTranslations[0].key;
    const values = initialTranslations[0].values;

    await expect(
      service.add({
        groupId: initialGroups[0].id,
        key,
        values,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('translation 추가 실패 - 소속 그룹의 자식 그룹 label과 중복되는 key', async () => {
    const parentGroup = initialGroups[0];
    const childGroup = db
      .get('groups')
      .find({ parentId: parentGroup.id })
      .value();

    const key = childGroup.label;
    const values = [
      { localeId: initialLocales[0].id, value: faker.word.words() },
      { localeId: initialLocales[1].id, value: faker.word.words() },
    ];

    await expect(
      service.add({
        groupId: parentGroup.id,
        key,
        values,
      }),
    ).rejects.toThrow(ConflictException);
  });
});
