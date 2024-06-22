import { useState } from "react";

import { Button } from "~/core/button";
import { AddLocaleReqBodyDto } from "~/core/codegen";
import { i18nKeys, useTranslation } from "~/core/i18n";
import { Input } from "~/core/input";
import { VStack } from "~/core/layout";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "~/core/modal";
import { KEY, LINK, useMutation } from "~/core/react-query";
import { Text } from "~/core/text";

type AddLocaleModalProps = ModalProps & {
  onComplete?: () => void;
  position: number;
};

export const AddLocaleModal = ({
  isOpen,
  onClose,
  onComplete,
  position,
}: AddLocaleModalProps) => {
  const { t } = useTranslation();
  const [label, setLabel] = useState("");

  const { mutate: addLocale } = useMutation<AddLocaleReqBodyDto>({
    refetchQueryKeys: [[KEY.GET_LOCALES]],
    toastMessage: t(i18nKeys.setting.addLocaleSuccess),
  });

  const handleSubmit = () => {
    addLocale({
      link: LINK.ADD_LOCALE,
      method: "post",
      body: {
        label,
        position,
      },
    });
    onClose();
    onComplete?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <Text>{t(i18nKeys.setting.addLocale)}</Text>
      </ModalHeader>
      <ModalBody>
        <VStack alignItems="baseline" width="full">
          <Text fontSize="xs" fontWeight="lighter">
            {t(i18nKeys.setting.newLocale)}
          </Text>
          <Input
            placeholder="Locale Code"
            onChange={(e) => setLabel(e.target.value)}
            value={label}
          />
        </VStack>
      </ModalBody>
      <ModalFooter onClose={onClose}>
        <Button colorScheme="darkgray" onClick={handleSubmit}>
          {t(i18nKeys.common.save)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
