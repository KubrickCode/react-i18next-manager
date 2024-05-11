import {
  Button as ChakraButton,
  ButtonProps,
  useColorModeValue,
} from "@chakra-ui/react";

export const Button = (props: ButtonProps) => {
  const colorScheme = useColorModeValue("primary", "gray");
  return <ChakraButton colorScheme={colorScheme} {...props} />;
};
