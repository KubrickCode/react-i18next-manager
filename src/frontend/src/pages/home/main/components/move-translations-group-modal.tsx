import { useState } from "react";

import { Button } from "~/core/button";
import {
  EditTranslationsParentGroupReqBodyDto,
  GetGroupsResDto,
} from "~/core/codegen";
import { z } from "~/core/form";
import { i18nKeys, useTranslation } from "~/core/i18n";
import { VStack } from "~/core/layout";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "~/core/modal";
import {
  KEY,
  ENDPOINT,
  useMutation,
  useSuspenseQuery,
} from "~/core/react-query";
import { Text } from "~/core/text";
import { GroupTreeView } from "~/shared/group";

const schema = z.object({
  translations: z.array(
    z.object({
      id: z.string().uuid(),
    })
  ),
  newGroupId: z.string().uuid(),
});

type Group = {
  id: string;
  label: string;
};

type SelectedGroup = Group | null;

type MoveTranslationsGroupModalProps = ModalProps & {
  currentGroup: Group;
  onComplete: () => void;
  translationIds: string[];
};

export const MoveTranslationsGroupModal = ({
  currentGroup,
  isOpen,
  onClose,
  onComplete,
  translationIds,
}: MoveTranslationsGroupModalProps) => {
  const { t } = useTranslation();
  const { data } = useSuspenseQuery<GetGroupsResDto>(
    ENDPOINT.GET_GROUPS,
    KEY.GET_GROUPS_IN_MOVE_GROUP_MODAL
  );
  const [selectedGroup, setSelectedGroup] = useState<SelectedGroup>(null);
  const [error, setError] = useState<string | null>(null);

  const { groups } = data;

  const { mutate: editTranslationsParentGroup } =
    useMutation<EditTranslationsParentGroupReqBodyDto>({
      refetchQueryKeys: [[KEY.GET_TRANSLATIONS(currentGroup.id)]],
      schema,
      toastMessage: t(i18nKeys.group.moveGroupSuccess),
    });

  const handleSubmit = () => {
    if (selectedGroup === null) {
      setError(t(i18nKeys.group.selectTargetGroupEmptyError));
      return;
    }

    editTranslationsParentGroup({
      endpoint: ENDPOINT.EDIT_TRANSLATIONS_PARENT_GROUP,
      method: "patch",
      body: {
        translations: translationIds.map((id) => ({ id })),
        newGroupId: selectedGroup.id,
      },
    });
    onClose();
    onComplete();
  };

  const handleSelectedGroup = (group: SelectedGroup) => {
    setSelectedGroup(group);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <Text>{t(i18nKeys.group.moveGroup)}</Text>
      </ModalHeader>
      <ModalBody>
        <VStack alignItems="baseline" gap={5}>
          <VStack alignItems="baseline">
            <Text fontSize="xs" fontWeight="lighter">
              {t(i18nKeys.group.currentGroup)}
            </Text>
            <Text fontWeight="semibold">{currentGroup.label}</Text>
          </VStack>
          <VStack alignItems="baseline">
            <Text fontSize="xs" fontWeight="lighter">
              {t(i18nKeys.group.selectTargetGroup)}
            </Text>
            <GroupTreeView
              groups={groups}
              handleSelectedGroup={handleSelectedGroup}
              height={300}
              width={400}
            />
          </VStack>
          {error && (
            <Text color="danger" fontSize="sm">
              {error}
            </Text>
          )}
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
