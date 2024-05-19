import { forwardRef } from "react";
import {
  IconButton as ChakraIconButton,
  IconButtonProps,
  useColorModeValue,
} from "@chakra-ui/react";

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    const colorScheme = useColorModeValue("darkgray", "gray");
    return <ChakraIconButton ref={ref} colorScheme={colorScheme} {...props} />;
  }
);

IconButton.displayName = "IconButton";
