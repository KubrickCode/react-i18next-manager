import { chakra, useColorModeValue } from "@chakra-ui/react";
import { Select, SelectButton, SelectList } from "@saas-ui/react";

import { useI18n } from "~/core/i18n";

const supportedLanguages = [
  { key: "en", label: "English" },
  { key: "ko", label: "한국어" },
];

export const LanguageSelect = () => {
  const selectButtonBorder = useColorModeValue(
    "1px solid lightgray",
    "1px solid gray"
  );

  const { changeLanguage, language: currentLanguage } = useI18n();

  return (
    <Select
      defaultValue={currentLanguage}
      name="language"
      onChange={(value) => {
        changeLanguage(value);
      }}
      options={supportedLanguages.map(({ key, label }) => ({
        label,
        value: key,
      }))}
    >
      <CustomSelectButton
        backgroundColor="transparent"
        border={selectButtonBorder}
        width="100%"
      />
      <CustomSelectList />
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

const CustomSelectList = () => {
  const selectListHoverBg = useColorModeValue("gray.100", "gray.600");

  return (
    <chakra.div
      as={SelectList}
      sx={{
        button: {
          _hover: {
            backgroundColor: selectListHoverBg,
          },
          backgroundColor: "transparent",
        },
      }}
    />
  );
};
