import { generateUUID } from 'src/common/utils';
import { GroupSchema, LocaleSchema } from 'src/db/db.schema';

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
