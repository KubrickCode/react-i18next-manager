export type LocaleSchema = {
  id: string;
  label: string;
  position: number;
};

export type GroupSchema = {
  id: string;
  label: string;
  position: number;
  children: GroupSchema[];
};

export type DBSchema = {
  locales: LocaleSchema[];
  groups: GroupSchema[];
};
