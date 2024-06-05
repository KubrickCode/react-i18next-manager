import { faker } from '@faker-js/faker';
import { generateUUID } from 'src/common/utils';
import { GroupSchema, LocaleSchema, TranslationSchema } from 'src/db/db.schema';

export const initialLocales: LocaleSchema[] = [
  {
    id: generateUUID(),
    label: 'en',
    position: 0,
  },
  {
    id: generateUUID(),
    label: 'ko',
    position: 1,
  },
];

export const initialParentId = generateUUID();

export const initialGroups: GroupSchema[] = [
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

export const initialTranslations: TranslationSchema[] = [
  {
    id: generateUUID(),
    groupId: initialGroups[0].id,
    key: faker.word.noun(),
    values: [
      {
        localeId: initialLocales[0].id,
        value: faker.word.words(),
      },
      {
        localeId: initialLocales[1].id,
        value: faker.word.words(),
      },
    ],
  },
  {
    id: generateUUID(),
    groupId: initialGroups[0].id,
    key: faker.word.noun(),
    values: [
      {
        localeId: initialLocales[0].id,
        value: faker.word.words(),
      },
      {
        localeId: initialLocales[1].id,
        value: faker.word.words(),
      },
    ],
  },
  {
    id: generateUUID(),
    groupId: initialGroups[1].id,
    key: faker.word.noun(),
    values: [
      {
        localeId: initialLocales[0].id,
        value: faker.word.words(),
      },
      {
        localeId: initialLocales[1].id,
        value: faker.word.words(),
      },
    ],
  },
  {
    id: generateUUID(),
    groupId: initialGroups[1].id,
    key: faker.word.noun(),
    values: [
      {
        localeId: initialLocales[0].id,
        value: faker.word.words(),
      },
      {
        localeId: initialLocales[1].id,
        value: faker.word.words(),
      },
    ],
  },
  {
    id: generateUUID(),
    groupId: initialGroups[2].id,
    key: faker.word.noun(),
    values: [
      {
        localeId: initialLocales[0].id,
        value: faker.word.words(),
      },
      {
        localeId: initialLocales[1].id,
        value: faker.word.words(),
      },
    ],
  },
  {
    id: generateUUID(),
    groupId: initialGroups[2].id,
    key: faker.word.noun(),
    values: [
      {
        localeId: initialLocales[0].id,
        value: faker.word.words(),
      },
      {
        localeId: initialLocales[1].id,
        value: faker.word.words(),
      },
    ],
  },
  {
    id: generateUUID(),
    groupId: initialGroups[3].id,
    key: faker.word.noun(),
    values: [
      {
        localeId: initialLocales[0].id,
        value: faker.word.words(),
      },
      {
        localeId: initialLocales[1].id,
        value: faker.word.words(),
      },
    ],
  },
  {
    id: generateUUID(),
    groupId: initialGroups[3].id,
    key: faker.word.noun(),
    values: [
      {
        localeId: initialLocales[0].id,
        value: faker.word.words(),
      },
      {
        localeId: initialLocales[1].id,
        value: faker.word.words(),
      },
    ],
  },
];
