import {
  MenuButton as ChakraMenuButton,
  MenuButtonProps as ChakraMenuButtonProps,
  IconButtonProps,
} from "@chakra-ui/react";

type MenuButtonProps = ChakraMenuButtonProps & IconButtonProps;

export const MenuButton = (props: MenuButtonProps) => (
  <ChakraMenuButton {...props} />
);
