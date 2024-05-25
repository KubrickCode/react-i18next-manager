export default {
  GET_GROUPS: "getGroups",
  GET_LOCALES: "getLocales",
  GET_TRANSLATIONS: (groupId: string) => `getTranslations-${groupId}`,
};
