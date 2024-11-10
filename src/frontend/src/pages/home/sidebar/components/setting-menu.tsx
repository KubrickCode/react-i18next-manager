import { IoIosSettings } from "react-icons/io";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { FaLanguage } from "react-icons/fa";
import { AiOutlineFileSync } from "react-icons/ai";

import { Text } from "~/core/text";
import { IconButton } from "~/core/button";
import { useMutation } from "~/core/react-query";
import { i18nKeys, useTranslation } from "~/core/i18n";
import { LocaleManagementModal } from "~/shared/locale";

import { LanguageSelect } from "./language-select";
import {
  Box,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { MenuModalToggle } from "~/core/modal";

export const SettingMenu = () => {
  const { t } = useTranslation();
  const { toggleColorMode } = useColorMode();

  const darkModeIcon = useColorModeValue(
    <MdDarkMode />,
    <CiLight color="white" />
  );
  const darkModeLabel = useColorModeValue(
    t(i18nKeys.setting.darkMode),
    t(i18nKeys.setting.lightMode)
  );

  const { mutate: generateI18nResources } = useMutation({
    toast: t(i18nKeys.setting.generateI18nSuccess),
  });

  const handleGenerateI18nResources = () => {
    generateI18nResources({
      endpoint: "/api/generate-i18n",
      method: "post",
    });
  };

  return (
    <Menu>
      <MenuButton
        aria-label="setting-menu-button"
        as={IconButton}
        colorScheme="gray"
        icon={<IoIosSettings />}
        size="sm"
        variant="outline"
      />
      <MenuList>
        <MenuItem
          closeOnSelect={false}
          icon={darkModeIcon}
          onClick={() => toggleColorMode()}
        >
          <Text>{darkModeLabel}</Text>
        </MenuItem>
        <MenuModalToggle icon={<FaLanguage />} modal={LocaleManagementModal}>
          <Text>{t(i18nKeys.setting.localeManagement)}</Text>
        </MenuModalToggle>
        <MenuItem
          icon={<AiOutlineFileSync />}
          onClick={handleGenerateI18nResources}
        >
          <Text>{t(i18nKeys.setting.generateI18n)}</Text>
        </MenuItem>
        <MenuDivider />
        <MenuGroup title={t(i18nKeys.setting.selectLanguage)}>
          <Box paddingX={3}>
            <LanguageSelect />
          </Box>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};
