type TranslationValue  = {
localeId: string;
value: string;
}
export type EditTranslationReqBodyDto  = {
newKey: string;
newValues: TranslationValue[];
}
export type EditTranslationReqParamDto  = {
id: string;
}
