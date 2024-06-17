import { chakra } from "@chakra-ui/react";
import _ from "lodash";

import { useI18n } from "~/core/i18n";
import { Select, SelectButton, SelectList } from "~/core/select";

const supportedLanguages = [
  { key: "en", label: "English" },
  { key: "ko", label: "한국어" },
];

export const LanguageSelect = () => {
  const { changeLanguage, language: currentLanguage } = useI18n();

  const currentLanguageLabel = _.find(
    supportedLanguages,
    (language) => language.key === currentLanguage
  )?.label;

  return (
    <Select
      defaultValue={currentLanguageLabel}
      name="language"
      onChange={(value) => {
        changeLanguage(value);
      }}
      options={supportedLanguages.map(({ key, label }) => ({
        label,
        value: key,
      }))}
    >
      <CustomSelectButton width="100%" />
      <SelectList />
    </Select>
  );
};

const CustomSelectButton = chakra(SelectButton, {
  baseStyle: {
    span: {
      paddingY: "2",
    },
  },
});
