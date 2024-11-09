import { ReactNode } from "react";

import { Endpoint, QueryKey } from "../react-query";
import { ModalHeader } from "./modal-header";
import { ModalBody } from "./modal-body";
import { ModalFooter } from "./modal-footer";
import { Text } from "../text";
import { i18nKeys, useTranslation } from "../i18n";
import { MutationForm, SubmitButton } from "../form";
import { useModal } from "./modal-toggle";

type DeleteModelProps = {
  body: ReactNode;
  endpoint: Endpoint;
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
}: DeleteModelProps) => {
  const { t } = useTranslation();
  const { onClose } = useModal();

  return (
    <>
      <MutationForm
        endpoint={endpoint}
        method="delete"
        onComplete={() => {
          onComplete?.();
          onClose();
        }}
        refetchQueryKeys={refetchQueryKeys}
        toast={toast}
      >
        <ModalHeader>
          <Text>{t(i18nKeys.common.deleteConfirmation)}</Text>
        </ModalHeader>
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
          <SubmitButton colorScheme="red">
            {t(i18nKeys.common.delete)}
          </SubmitButton>
        </ModalFooter>
      </MutationForm>
    </>
  );
};
