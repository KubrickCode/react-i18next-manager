import {
  MenuItem as ChakraMenuItem,
  MenuItemProps as ChakraMenuItemProps,
} from "@chakra-ui/react";

export type MenuItemProps = ChakraMenuItemProps;
export const MenuItem = (props: MenuItemProps) => <ChakraMenuItem {...props} />;
