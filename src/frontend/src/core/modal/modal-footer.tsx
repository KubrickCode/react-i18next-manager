import { ModalFooter as ChakraModalFooter, Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

import { Button } from "../button";
import { i18nKeys, useTranslation } from "../i18n";

export type ModalFooterProps = {
  onClose: () => void;
} & PropsWithChildren;

export const ModalFooter = ({ children, onClose }: ModalFooterProps) => {
  const { t } = useTranslation();

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
