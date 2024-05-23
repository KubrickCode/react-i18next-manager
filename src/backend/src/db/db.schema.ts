import { UUID } from 'src/common/types';

export type LocaleSchema = {
  id: UUID;
  label: string;
  position: number;
};

export type GroupSchema = {
  id: UUID;
  label: string;
  position: number;
  children: GroupSchema[];
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
