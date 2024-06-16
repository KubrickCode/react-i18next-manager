import { chakra } from "@chakra-ui/react";

import { Select, SelectButton, SelectList } from "~/core/select";

export const LanguageSelect = () => (
  <Select
    defaultValue="English"
    name="language"
    options={["English", "Korean"].map((lang) => ({
      label: lang,
      value: lang,
    }))}
  >
    <CustomSelectButton width="100%" />
    <SelectList />
  </Select>
);

const CustomSelectButton = chakra(SelectButton, {
  baseStyle: {
    span: {
      paddingY: "2",
    },
  },
});
