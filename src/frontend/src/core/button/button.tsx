import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  useColorModeValue,
} from "@chakra-ui/react";

export type ButtonProps = ChakraButtonProps;

export const Button = (props: ButtonProps) => {
  const colorScheme = useColorModeValue("darkgray", "gray");
  return <ChakraButton colorScheme={colorScheme} {...props} />;
};
