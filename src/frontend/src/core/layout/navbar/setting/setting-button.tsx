import { IoIosSettings } from "react-icons/io";
import { IconButton } from "@chakra-ui/react";

import { Menu, MenuButton, MenuItem, MenuList } from "@core/menu";

export const SettingButton = () => (
  <Menu>
    <MenuButton
      aria-label="setting-menu-button"
      as={IconButton}
      icon={<IoIosSettings />}
      size="sm"
      variant="outline"
    />
    <MenuList>
      <MenuItem icon={<IoIosSettings />}>Some Item</MenuItem>
    </MenuList>
  </Menu>
);
