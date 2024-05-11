import { ModalFooter as ChakraModalFooter, Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

import { Button } from "../button";
import { LABELS } from "../constants";

export type ModalFooterProps = {
  onClose: () => void;
} & PropsWithChildren;

export const ModalFooter = ({ children, onClose }: ModalFooterProps) => {
  return (
    <ChakraModalFooter>
      <Flex direction="column">
        <Flex gap={3} justifyContent="right">
          <Button onClick={onClose}>{LABELS.CLOSE}</Button>
          {children}
        </Flex>
      </Flex>
    </ChakraModalFooter>
  );
};
