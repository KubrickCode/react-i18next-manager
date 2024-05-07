import { IoIosSettings } from "react-icons/io";
import {
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdDarkMode, MdPeopleOutline } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { useModals } from "@saas-ui/react";

import { Menu, MenuButton, MenuItem, MenuList } from "@core/menu";

import { ConfigManagementModalBody } from "./components/config-management-modal-body";
import { FaLanguage } from "react-icons/fa";

export const SettingButton = () => {
  const { toggleColorMode } = useColorMode();
  const modals = useModals();

  const darkModeIcon = useColorModeValue(
    <MdDarkMode size="1rem" />,
    <CiLight color="white" size="1rem" />
  );
  const darkModeLabel = useColorModeValue("Dark Mode", "Light Mode");
  const fontColor = useColorModeValue("gray.800", "white");

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
        <MenuItem
          icon={<MdPeopleOutline />}
          onClick={() =>
            modals.open({
              title: <Text color={fontColor}>Group Management</Text>,
              body: <ConfigManagementModalBody configKind="groups" />,
            })
          }
        >
          Group Management
        </MenuItem>
        <MenuItem
          icon={<FaLanguage />}
          onClick={() =>
            modals.open({
              title: <Text color={fontColor}>Language Management</Text>,
              body: <ConfigManagementModalBody configKind="languages" />,
            })
          }
        >
          Language Management
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
