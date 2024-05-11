import { ReactNode } from "react";

import { Modal, ModalProps } from "./modal";
import { QueryKey, useMutation } from "../tanstack-react-query";
import { ModalHeader } from "./modal-header";
import { LABELS } from "../constants";
import { ModalBody } from "./modal-body";
import { ModalFooter } from "./modal-footer";
import { Button } from "../button";
import { Text } from "../text";

type DeleteModelProps = ModalProps & {
  body: ReactNode;
  link: string;
  refetchQueryKeys?: QueryKey[];
};

export const DeleteModal = ({
  body,
  link,
  refetchQueryKeys,
  ...modalProps
}: DeleteModelProps) => {
  const { mutate } = useMutation({
    refetchQueryKeys,
  });

  return (
    <Modal {...modalProps}>
      <ModalHeader>
        <Text>{LABELS.DELETE_CONFIRMATION}</Text>
      </ModalHeader>
      <ModalBody>{body}</ModalBody>
      <ModalFooter onClose={modalProps.onClose}>
        <Button
          colorScheme="red"
          onClick={() => {
            mutate({
              link,
              method: "delete",
            });
          }}
        >
          {LABELS.DELETE}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
