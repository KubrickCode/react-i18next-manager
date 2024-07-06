import {
  Input as ChakraInput,
  InputProps as ChakraProps,
  useColorModeValue,
} from "@chakra-ui/react";

export type InputProps = ChakraProps;

export const Input = (props: InputProps) => {
  const fontColor = useColorModeValue("black", "white");
  return <ChakraInput color={fontColor} {...props} />;
};
