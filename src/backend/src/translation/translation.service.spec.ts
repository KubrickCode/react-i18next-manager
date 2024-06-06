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

  it('translation 수정 성공', async () => {
    const translation = initialTranslations[0];
    const newKey = faker.word.noun();
    const newValues = [
      { localeId: initialLocales[0].id, value: faker.word.words() },
      { localeId: initialLocales[1].id, value: faker.word.words() },
    ];

    await service.edit({
      id: translation.id,
      newKey,
      newValues,
    });

    const result = db.get('translations').find({ id: translation.id }).value();
    const expected = {
      ...translation,
      key: newKey,
      values: newValues,
    };

    expect(result).toEqual(expected);
  });

  it('translation 수정 실패 - 이미 존재하는 key', async () => {
    const translation = initialTranslations[0];
    const key = initialTranslations[1].key;

    await expect(
      service.edit({
        id: translation.id,
        newKey: key,
        newValues: translation.values,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('translation 수정 실패 - 소속 그룹의 자식 그룹 label과 중복되는 key', async () => {
    const translation = initialTranslations[0];
    const parentGroup = initialGroups[0];
    const childGroup = db
      .get('groups')
      .find({ parentId: parentGroup.id })
      .value();

    const key = childGroup.label;

    await expect(
      service.edit({
        id: translation.id,
        newKey: key,
        newValues: translation.values,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('하나의 translation 삭제 성공', async () => {
    const translation = initialTranslations[0];

    await service.deleteMany({
      translations: [{ id: translation.id }],
    });

    const result = db.get('translations').find({ id: translation.id }).value();

    expect(result).toBeUndefined();
  });

  it('여러 translation 삭제 성공', async () => {
    const translations = initialTranslations.slice(0, 2);

    await service.deleteMany({
      translations: translations.map((translation) => ({ id: translation.id })),
    });

    const result = db
      .get('translations')
      .filter((translation) =>
        translations.some((t) => t.id === translation.id),
      )
      .value();

    expect(result).toHaveLength(0);
  });
});
