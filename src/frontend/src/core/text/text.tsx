import {
  Text as ChakraText,
  TextProps,
  useColorModeValue,
} from "@chakra-ui/react";

export const Text = (props: TextProps) => {
  const fontColor = useColorModeValue("black", "white");
  return <ChakraText color={fontColor} {...props} />;
};
