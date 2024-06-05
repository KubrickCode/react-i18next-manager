import { Test, TestingModule } from '@nestjs/testing';
import { LocaleService } from './locale.service';
import { DB, DBService } from 'src/db/db.service';
import { ConflictException } from '@nestjs/common';
import { LocaleFactory } from 'src/test/locale.factory';
import { localeModuleConfig } from './locale.module.config';
import {
  initialGroups,
  initialLocales,
  initialTranslations,
} from 'src/test/seed.data';

describe('LocaleService Integration', () => {
  let module: TestingModule;
  let service: LocaleService;
  let dbService: DBService;
  let db: DB;
  let factory: LocaleFactory;

  beforeAll(async () => {
    module = await Test.createTestingModule(localeModuleConfig).compile();

    service = module.get<LocaleService>(LocaleService);
    dbService = module.get<DBService>(DBService);

    db = await dbService.get();
    factory = new LocaleFactory(db);
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

  it('모든 locales 반환 성공', async () => {
    const result = await service.getAll();

    expect(result.locales).toEqual(initialLocales);
  });

  it('순서가 바뀐 locales를 올바르게 정렬하여 반환', async () => {
    const enLocale = factory.create({
      label: initialLocales[0].label,
      position: 1,
    });
    const koLocale = factory.create({
      label: initialLocales[1].label,
      position: 0,
    });
    db.setState({
      locales: [enLocale, koLocale],
      groups: [],
      translations: [],
    }).write();

    const result = await service.getAll();

    const expectedLocales = [koLocale, enLocale];
    expect(result.locales).toEqual(expectedLocales);
  });

  it('새로운 locale을 정상적으로 추가', async () => {
    const newLocale = { label: 'fr', position: 2 };
    await service.add(newLocale);

    const locales = db.get('locales').value();
    expect(locales).toContainEqual(expect.objectContaining(newLocale));
  });

  it('이미 존재하는 locale label 추가 시 ConflictException 발생', async () => {
    const existingLocale = factory.create({
      label: initialLocales[0].label,
      position: 2,
    });

    await expect(service.add(existingLocale)).rejects.toThrow(
      ConflictException,
    );
  });

  it('locale의 label을 정상적으로 업데이트', async () => {
    const updatedLocale = {
      id: initialLocales[0].id,
      newLabel: 'fr',
    };
    await service.editLabel(updatedLocale);

    const locales = db.get('locales').value();
    expect(locales).toContainEqual(
      expect.objectContaining({ id: updatedLocale.id, label: 'fr' }),
    );
  });

  it('이미 존재하는 locale label로 업데이트 시 ConflictException 발생', async () => {
    const updatedLocale = {
      id: initialLocales[0].id,
      newLabel: initialLocales[1].label,
    };

    await expect(service.editLabel(updatedLocale)).rejects.toThrow(
      ConflictException,
    );
  });

  it('여러 locales의 위치를 정상적으로 업데이트', async () => {
    const updateLocales = [
      { id: initialLocales[0].id, position: 1 },
      { id: initialLocales[1].id, position: 0 },
    ];
    await service.editPosition({ locales: updateLocales });

    const locales = db.get('locales').sortBy('position').value();
    expect(locales).toEqual([
      expect.objectContaining({ label: initialLocales[1].label, position: 0 }),
      expect.objectContaining({ label: initialLocales[0].label, position: 1 }),
    ]);
  });

  it('존재하는 locale 삭제 성공', async () => {
    await service.delete({ id: initialLocales[0].id });

    const locales = db.get('locales').value();
    expect(locales).not.toContainEqual(
      expect.objectContaining({ id: initialLocales[0].id }),
    );
  });

  it('locales 삭제 시 해당 locale을 사용하는 translation도 삭제', async () => {
    // 삭제할 locale과 이를 사용하는 translations 설정
    const localeIdToDelete = initialLocales[0].id;
    const translationsUsingLocale = initialTranslations.filter((translation) =>
      translation.values.some((value) => value.localeId === localeIdToDelete),
    );

    // 삭제 이전에 translations이 존재하는지 확인
    const existingTranslations = db
      .get('translations')
      .filter((translation) =>
        translationsUsingLocale.map((t) => t.id).includes(translation.id),
      )
      .value();
    expect(existingTranslations).toHaveLength(translationsUsingLocale.length);

    // locale 삭제
    await service.delete({ id: localeIdToDelete });

    // locale 삭제 이후 translations이 존재하지 않는지 확인
    const remainingTranslations = db
      .get('translations')
      .filter((translation) =>
        translationsUsingLocale.map((t) => t.id).includes(translation.id),
      )
      .value();
    expect(remainingTranslations).toHaveLength(0);
  });
});
