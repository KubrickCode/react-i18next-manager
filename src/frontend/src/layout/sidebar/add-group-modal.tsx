import { useState } from "react";

import { Button } from "~/core/button";
import { AddGroupReqBodyDto } from "~/core/codegen";
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
import { Text } from "~/core/text";

type AddGroupModalProps = ModalProps & {
  onComplete: () => void;
  parentId: string | null;
  parentName: string;
};

export const AddGroupModal = ({
  isOpen,
  onClose,
  onComplete,
  parentId,
  parentName,
}: AddGroupModalProps) => {
  const [label, setLabel] = useState("");

  const { mutate: addGroup } = useMutation<AddGroupReqBodyDto>({
    refetchQueryKeys: [["getGroups"]],
  });

  const handleSubmit = () => {
    addGroup({
      link: "/groups",
      method: "post",
      body: {
        label,
        parentId,
      },
    });
    onClose();
    onComplete();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <Text>Add Group</Text>
      </ModalHeader>
      <ModalBody>
        <VStack alignItems="baseline" gap={5}>
          <VStack alignItems="baseline">
            <Text fontSize="xs" fontWeight="lighter">
              Parent Group
            </Text>
            <Text fontWeight="semibold">{parentName}</Text>
          </VStack>
          <VStack alignItems="baseline" width="full">
            <Text fontSize="xs" fontWeight="lighter">
              New Group
            </Text>
            <Input
              placeholder="Group Name"
              onChange={(e) => setLabel(e.target.value)}
              value={label}
            />
          </VStack>
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
