import { UUID } from 'src/common';

export type LocaleSchema = {
  id: UUID;
  label: string;
  position: number;
};

export type GroupSchema = {
  id: UUID;
  parentId: UUID | null;
  label: string;
  position: number;
};

export type TranslationSchema = {
  id: UUID;
  groupId: UUID;
  key: string;
  values: {
    localeId: UUID;
    value: string;
  }[];
};

export type DBSchema = {
  locales: LocaleSchema[];
  groups: GroupSchema[];
  translations: TranslationSchema[];
};
