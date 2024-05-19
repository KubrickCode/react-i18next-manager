import { IoIosSettings } from "react-icons/io";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { FaLanguage } from "react-icons/fa";

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

import { LocaleManagementModal } from "./locale-management-modal";

export const SettingButton = () => {
  const { toggleColorMode } = useColorMode();

  const darkModeIcon = useColorModeValue(
    <MdDarkMode size="1rem" />,
    <CiLight color="white" size="1rem" />
  );
  const darkModeLabel = useColorModeValue("Dark Mode", "Light Mode");

  return (
    <Menu>
      <MenuButton
        aria-label="setting-menu-button"
        as={IconButton}
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
        <MenuModalToggle icon={FaLanguage} modal={LocaleManagementModal}>
          {LABELS.LOCALE_MANAGEMENT}
        </MenuModalToggle>
      </MenuList>
    </Menu>
  );
};
