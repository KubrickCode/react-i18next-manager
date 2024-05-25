export default {
  GET_LOCALES: "/locales",
  ADD_LOCALE: "/locales",
  EDIT_LOCALES_POSITION: "/locales/position",
  EDIT_LOCALE_LABEL: (localeId: string) => `/locales/label/${localeId}`,
  DELETE_LOCALE: (localeId: string) => `/locales/${localeId}`,

  GET_GROUPS: "/groups",
  ADD_GROUP: "/groups",
  EDIT_GROUP_LABEL: (groupId: string) => `/groups/label/${groupId}`,
  EDIT_GROUP_POSITION: (groupId: string) => `/groups/position/${groupId}`,
  DELETE_GROUP: (groupId: string) => `/groups/${groupId}`,

  DELETE_TRANSLATIONS: "/translations/delete",
  ADD_TRANSLATION: (groupId: string) => `/translations/${groupId}`,
  EDIT_TRANSLATION: (translationId: string) => `/translations/${translationId}`,
  GET_TRANSLATIONS: (groupId: string) => `/translations/${groupId}`,

  GENERATE_I18N_JSON: "/generate-i18n",
};
