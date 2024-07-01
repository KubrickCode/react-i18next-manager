import { ReactNode } from "react";

import { Modal, ModalProps } from "./modal";
import { QueryKey, useMutation } from "../react-query";
import { ModalHeader } from "./modal-header";
import { ModalBody } from "./modal-body";
import { ModalFooter } from "./modal-footer";
import { Button } from "../button";
import { Text } from "../text";
import { i18nKeys, useTranslation } from "../i18n";

type DeleteModelProps = ModalProps & {
  body: ReactNode;
  endpoint: string;
  onComplete?: () => void;
  refetchQueryKeys?: QueryKey[];
  toastMessage?: string;
};

export const DeleteModal = ({
  body,
  endpoint,
  onComplete,
  refetchQueryKeys,
  toastMessage,
  ...modalProps
}: DeleteModelProps) => {
  const { t } = useTranslation();
  const { mutate } = useMutation({
    refetchQueryKeys,
    toastMessage,
  });

  const handleComplete = () => {
    mutate({
      endpoint,
      method: "delete",
    });
    onComplete?.();
    modalProps.onClose();
  };

  return (
    <Modal {...modalProps}>
      <ModalHeader>
        <Text>{t(i18nKeys.common.deleteConfirmation)}</Text>
      </ModalHeader>
      <ModalBody>{body}</ModalBody>
      <ModalFooter onClose={modalProps.onClose}>
        <Button colorScheme="red" onClick={handleComplete}>
          {t(i18nKeys.common.delete)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
