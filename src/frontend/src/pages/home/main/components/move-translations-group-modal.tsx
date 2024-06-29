import { useState } from "react";

import { Button } from "~/core/button";
import { GetGroupsResDto } from "~/core/codegen";
import { i18nKeys, useTranslation } from "~/core/i18n";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "~/core/modal";
import { KEY, LINK, useSuspenseQuery } from "~/core/react-query";
import { Text } from "~/core/text";
import { GroupTreeView } from "~/shared/group";

type SelectedGroup = {
  id: string;
  label: string;
} | null;

type MoveTranslationsGroupModalProps = ModalProps & {
  translationIds: string[];
};

export const MoveTranslationsGroupModal = ({
  isOpen,
  onClose,
  translationIds,
}: MoveTranslationsGroupModalProps) => {
  const { t } = useTranslation();
  const { data } = useSuspenseQuery<GetGroupsResDto>(
    LINK.GET_GROUPS,
    KEY.GET_GROUPS_IN_MOVE_GROUP_MODAL
  );
  const [selectedGroup, setSelectedGroup] = useState<SelectedGroup>(null);

  const { groups } = data;

  const handleSubmit = () => {
    console.log(selectedGroup);
    console.log(translationIds);
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
        <GroupTreeView
          groups={groups}
          handleSelectedGroup={handleSelectedGroup}
          height={300}
        />
      </ModalBody>
      <ModalFooter onClose={onClose}>
        <Button colorScheme="darkgray" onClick={handleSubmit}>
          {t(i18nKeys.common.save)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
