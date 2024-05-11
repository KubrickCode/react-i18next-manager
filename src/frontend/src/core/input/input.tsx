import {
  Input as ChakraInput,
  InputProps,
  useColorModeValue,
} from "@chakra-ui/react";

export const Input = (props: InputProps) => {
  const fontColor = useColorModeValue("black", "white");
  return <ChakraInput color={fontColor} {...props} />;
};
