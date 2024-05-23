export const GET_LOCALES = "/locales";
export const ADD_LOCALE = "/locales";
export const EDIT_LOCALES_POSITION = "/locales/position";
export const EDIT_LOCALE_LABEL = (localeId: string) =>
  `/locales/label/${localeId}`;
export const DELETE_LOCALE = (localeId: string) => `/locales/${localeId}`;

export const GET_GROUPS = "/groups";
export const ADD_GROUP = "/groups";
export const EDIT_GROUP_LABEL = (groupId: string) => `/groups/label/${groupId}`;
export const EDIT_GROUP_POSITION = (groupId: string) =>
  `/groups/position/${groupId}`;
export const DELETE_GROUP = (groupId: string) => `/groups/${groupId}`;

export const DELETE_TRANSLATIONS = "/translations/delete";
export const ADD_TRANSLATION = (groupId: string) => `/translations/${groupId}`;
export const EDIT_TRANSLATION = (translationId: string) =>
  `/translations/${translationId}`;
export const GET_TRANSLATIONS = (groupId: string) => `/translations/${groupId}`;
