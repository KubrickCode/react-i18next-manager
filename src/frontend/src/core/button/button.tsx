import {
  Button as ChakraButton,
  ButtonProps,
  useColorModeValue,
} from "@chakra-ui/react";

export const Button = (props: ButtonProps) => {
  const colorScheme = useColorModeValue("darkgray", "gray");
  return <ChakraButton colorScheme={colorScheme} {...props} />;
};
