import { useState } from "react";

import { Button } from "~/core/button";
import { AddGroupReqBodyDto } from "~/core/codegen";
import { z } from "~/core/form";
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
import { useMutation, ENDPOINT, KEY } from "~/core/react-query";
import { Text } from "~/core/text";
import { replaceBlank } from "~/core/utils";

const schema = z.object({
  label: z.string(),
  parentId: z.string().uuid().nullable(),
});

type AddGroupModalProps = ModalProps & {
  parentId: string | null;
  parentName: string;
};

export const AddGroupModal = ({
  isOpen,
  onClose,
  parentId,
  parentName,
}: AddGroupModalProps) => {
  const { t } = useTranslation();
  const [label, setLabel] = useState("");

  const { mutate: addGroup } = useMutation<AddGroupReqBodyDto>({
    refetchQueryKeys: [[KEY.GET_GROUPS]],
    schema,
    toast: t(i18nKeys.group.addGroupSuccess),
  });

  const handleSubmit = () => {
    addGroup({
      endpoint: ENDPOINT.ADD_GROUP,
      method: "post",
      body: {
        label,
        parentId,
      },
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <Text>{t(i18nKeys.group.addGroup)}</Text>
      </ModalHeader>
      <ModalBody>
        <VStack alignItems="baseline" gap={5}>
          <VStack alignItems="baseline">
            <Text fontSize="xs" fontWeight="lighter">
              {t(i18nKeys.group.parentGroup)}
            </Text>
            <Text fontWeight="semibold">{parentName}</Text>
          </VStack>
          <VStack alignItems="baseline" width="full">
            <Text fontSize="xs" fontWeight="lighter">
              {t(i18nKeys.group.newGroup)}
            </Text>
            <Input
              placeholder={t(i18nKeys.group.groupName)}
              onChange={(e) => setLabel(replaceBlank(e.target.value))}
              value={label}
            />
          </VStack>
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
