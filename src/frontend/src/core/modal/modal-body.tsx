import {
  ModalBody as ChakraModalBody,
  ModalBodyProps as ChakraModalBodyProps,
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export type ModalBodyProps = ChakraModalBodyProps & PropsWithChildren;

export const ModalBody = ({ children, ...otherProps }: ModalBodyProps) => (
  <ChakraModalBody {...otherProps}>{children}</ChakraModalBody>
);
