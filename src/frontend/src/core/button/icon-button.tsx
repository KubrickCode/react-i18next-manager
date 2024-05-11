import {
  IconButton as ChakraIconButton,
  IconButtonProps,
  useColorModeValue,
} from "@chakra-ui/react";

export const IconButton = (props: IconButtonProps) => {
  const colorScheme = useColorModeValue("primary", "gray");
  return <ChakraIconButton colorScheme={colorScheme} {...props} />;
};
