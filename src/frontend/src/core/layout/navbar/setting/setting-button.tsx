import { IoIosSettings } from "react-icons/io";

import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

export const SettingButton = () => (
  <Menu>
    <MenuButton
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
