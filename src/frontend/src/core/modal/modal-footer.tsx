import { ModalFooter as ChakraModalFooter, Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

import { Button } from "../button";
import { i18nKeys, useTranslation } from "../i18n";
import { useModal } from "./modal-toggle";

export type ModalFooterProps = PropsWithChildren;

export const ModalFooter = ({ children }: ModalFooterProps) => {
  const { t } = useTranslation();
  const { onClose } = useModal();

  return (
    <ChakraModalFooter>
      <Flex direction="column">
        <Flex gap={3} justifyContent="right">
          <Button colorScheme="gray" onClick={onClose}>
            {t(i18nKeys.common.close)}
          </Button>
          {children}
        </Flex>
      </Flex>
    </ChakraModalFooter>
  );
};
