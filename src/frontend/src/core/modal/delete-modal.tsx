import { ReactNode } from "react";

import { Modal, ModalProps } from "./modal";
import { QueryKey } from "../react-query";
import { ModalHeader } from "./modal-header";
import { ModalBody } from "./modal-body";
import { ModalFooter } from "./modal-footer";
import { Text } from "../text";
import { i18nKeys, useTranslation } from "../i18n";
import { MutationForm, SubmitButton } from "../form";

type DeleteModelProps = ModalProps & {
  body: ReactNode;
  endpoint: string;
  onComplete?: () => void;
  refetchQueryKeys?: QueryKey[];
  toast?: string;
};

export const DeleteModal = ({
  body,
  endpoint,
  onComplete,
  refetchQueryKeys,
  toast,
  ...modalProps
}: DeleteModelProps) => {
  const { t } = useTranslation();

  return (
    <Modal {...modalProps}>
      <MutationForm
        endpoint={endpoint}
        method="delete"
        onComplete={() => {
          onComplete?.();
          modalProps.onClose();
        }}
        refetchQueryKeys={refetchQueryKeys}
        toast={toast}
      >
        <ModalHeader>
          <Text>{t(i18nKeys.common.deleteConfirmation)}</Text>
        </ModalHeader>
        <ModalBody>{body}</ModalBody>
        <ModalFooter onClose={modalProps.onClose}>
          <SubmitButton colorScheme="red">
            {t(i18nKeys.common.delete)}
          </SubmitButton>
        </ModalFooter>
      </MutationForm>
    </Modal>
  );
};
