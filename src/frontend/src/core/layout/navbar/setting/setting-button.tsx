import { IoIosSettings } from "react-icons/io";
import {
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdDarkMode, MdPeopleOutline } from "react-icons/md";
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

import { ConfigManagementModal } from "./components/config-management-modal";

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
        <MenuModalToggle
          icon={MdPeopleOutline}
          modal={ConfigManagementModal}
          modalProps={{ configKind: "groups" }}
        >
          {LABELS.GROUP_MANAGEMENT}
        </MenuModalToggle>
        <MenuModalToggle
          icon={FaLanguage}
          modal={ConfigManagementModal}
          modalProps={{ configKind: "languages" }}
        >
          {LABELS.LANGUAGE_MANAGEMENT}
        </MenuModalToggle>
      </MenuList>
    </Menu>
  );
};
