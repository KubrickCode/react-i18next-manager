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
import { FaLanguage } from "react-icons/fa";

import { Menu, MenuButton, MenuItem, MenuList } from "~/core/menu";
import { LABELS } from "~/core/constants";

import { ConfigManagementModalBody } from "./components/config-management-modal-body";

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
              title: <Text color={fontColor}>{LABELS.GROUP_MANAGEMENT}</Text>,
              body: <ConfigManagementModalBody configKind="groups" />,
            })
          }
        >
          {LABELS.GROUP_MANAGEMENT}
        </MenuItem>
        <MenuItem
          icon={<FaLanguage />}
          onClick={() =>
            modals.open({
              title: (
                <Text color={fontColor}>{LABELS.LANGUAGE_MANAGEMENT}</Text>
              ),
              body: <ConfigManagementModalBody configKind="languages" />,
            })
          }
        >
          {LABELS.LANGUAGE_MANAGEMENT}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
