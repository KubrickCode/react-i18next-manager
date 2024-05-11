import { ModalHeader as ChakraModalHeader } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export const ModalHeader = ({ children }: PropsWithChildren) => (
  <ChakraModalHeader>{children}</ChakraModalHeader>
);
