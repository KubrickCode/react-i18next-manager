import { StackProps, VStack } from "@chakra-ui/react";
import { useColorModeValue } from "../color-mode";

export const Page = ({ ...otherProps }: StackProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const fontColor = useColorModeValue("gray.800", "white");

  return (
    <VStack
      align="stretch"
      backgroundColor={bgColor}
      color={fontColor}
      padding="1rem"
      width="auto"
      {...otherProps}
    />
  );
};
