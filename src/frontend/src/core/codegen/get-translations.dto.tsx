type Translation  = {
id: string;
localeId: string;
groupId: string;
key: string;
value: string;
}
export type GetTranslationsResDto  = {
translations: Translation[];
}
export type GetTranslationsReqParamDto  = {
groupId: string;
}
