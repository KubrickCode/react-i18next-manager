type Translation  = {
localeId: string;
key: string;
value: string;
}
export type AddTranslationsReqBodyDto  = {
newTranslations: Translation[];
}
export type AddTranslationsReqParamDto  = {
groupId: string;
}
