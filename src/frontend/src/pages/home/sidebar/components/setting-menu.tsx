import { IoIosSettings } from "react-icons/io";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { FaLanguage } from "react-icons/fa";
import { AiOutlineFileSync } from "react-icons/ai";

import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  MenuModalToggle,
} from "~/core/menu";
import { Text } from "~/core/text";
import { useColorMode, useColorModeValue } from "~/core/color-mode";
import { IconButton } from "~/core/button";
import { ENDPOINT, useMutation } from "~/core/react-query";
import { Box } from "~/core/layout";
import { i18nKeys, useTranslation } from "~/core/i18n";
import { LocaleManagementModal } from "~/shared/locale";

import { LanguageSelect } from "./language-select";

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
      endpoint: ENDPOINT.GENERATE_I18N_RESOURCES,
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
