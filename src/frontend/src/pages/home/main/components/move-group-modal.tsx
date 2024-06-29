import { Button } from "~/core/button";
import { i18nKeys, useTranslation } from "~/core/i18n";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "~/core/modal";
import { Text } from "~/core/text";

type MoveGroupModalProps = ModalProps & {
  translationIds: string[];
};

export const MoveGroupModal = ({
  isOpen,
  onClose,
  translationIds,
}: MoveGroupModalProps) => {
  const { t } = useTranslation();

  const handleSubmit = () => {
    console.log(translationIds);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <Text>{t(i18nKeys.group.moveGroup)}</Text>
      </ModalHeader>
      <ModalBody>
        <Text>Not Supported</Text>
      </ModalBody>
      <ModalFooter onClose={onClose}>
        <Button colorScheme="darkgray" onClick={handleSubmit}>
          {t(i18nKeys.common.save)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
