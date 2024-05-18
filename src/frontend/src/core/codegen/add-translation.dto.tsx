type TranslationValue  = {
localeId: string;
value: string;
}
export type AddTranslationReqBodyDto  = {
key: string;
values: TranslationValue[];
}
export type AddTranslationReqParamDto  = {
groupId: string;
}
