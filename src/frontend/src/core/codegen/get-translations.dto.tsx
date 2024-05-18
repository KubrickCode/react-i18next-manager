type TranslationValue  = {
localeId: string;
value: string;
}
type Translation  = {
id: string;
groupId: string;
key: string;
values: TranslationValue[];
}
export type GetTranslationsResDto  = {
translations: Translation[];
}
export type GetTranslationsReqParamDto  = {
groupId: string;
}
