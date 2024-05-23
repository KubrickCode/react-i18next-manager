export const GET_GROUPS = "getGroups";
export const GET_LOCALES = "getLocales";
export const GET_TRANSLATIONS = (groupId: string) =>
  `getTranslations-${groupId}`;
