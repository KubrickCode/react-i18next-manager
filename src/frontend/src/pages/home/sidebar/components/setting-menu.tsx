import { IoIosSettings } from "react-icons/io";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { FaLanguage } from "react-icons/fa";
import { AiOutlineFileSync } from "react-icons/ai";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuModalToggle,
} from "~/core/menu";
import { LABELS } from "~/core/constants";
import { Text } from "~/core/text";
import { useColorMode, useColorModeValue } from "~/core/color-mode";
import { IconButton } from "~/core/button";
import { LINK, TOAST_MESSAGE, useMutation } from "~/core/react-query";
import { LocaleManagementModal } from "~/shared/locale-management-modal";

export const SettingMenu = () => {
  const { toggleColorMode } = useColorMode();

  const darkModeIcon = useColorModeValue(
    <MdDarkMode />,
    <CiLight color="white" />
  );
  const darkModeLabel = useColorModeValue("Dark Mode", "Light Mode");

  const { mutate: generateI18nResources } = useMutation({
    toastMessage: TOAST_MESSAGE.GENERATE_I18N_RESOURCES,
  });

  const handleGenerateI18nResources = () => {
    generateI18nResources({
      link: LINK.GENERATE_I18N_RESOURCES,
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
          <Text>{LABELS.LOCALE_MANAGEMENT}</Text>
        </MenuModalToggle>
        <MenuItem
          icon={<AiOutlineFileSync />}
          onClick={handleGenerateI18nResources}
        >
          <Text>Generate I18n Resources</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
