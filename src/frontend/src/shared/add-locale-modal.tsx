import { useState } from "react";

import { Button } from "~/core/button";
import { AddLocaleReqBodyDto } from "~/core/codegen";
import { LABELS } from "~/core/constants";
import { Input } from "~/core/input";
import { VStack } from "~/core/layout";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "~/core/modal";
import { useMutation } from "~/core/react-query";
import { GET_LOCALES } from "~/core/react-query/keys";
import { Text } from "~/core/text";

type AddLocaleModalProps = ModalProps & {
  onComplete: () => void;
  position: number;
};

export const AddLocaleModal = ({
  isOpen,
  onClose,
  onComplete,
  position,
}: AddLocaleModalProps) => {
  const [label, setLabel] = useState("");

  const { mutate: addLocale } = useMutation<AddLocaleReqBodyDto>({
    refetchQueryKeys: [[GET_LOCALES]],
  });

  const handleSubmit = () => {
    addLocale({
      link: "/locales",
      method: "post",
      body: {
        label,
        position,
      },
    });
    onClose();
    onComplete();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <Text>Add Locale</Text>
      </ModalHeader>
      <ModalBody>
        <VStack alignItems="baseline" width="full">
          <Text fontSize="xs" fontWeight="lighter">
            New Locale
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
          {LABELS.SAVE}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
