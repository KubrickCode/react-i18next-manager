type Locale = {
  id: string;
  label: string;
  position: number;
};

type Group = {
  id: string;
  label: string;
  position: number;
  children: Group[];
};

export type DBSchema = {
  locales: Locale[];
  groups: Group[];
};
