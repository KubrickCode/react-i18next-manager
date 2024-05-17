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

export type DBSchema = {
  locales: LocaleSchema[];
  groups: GroupSchema[];
};
