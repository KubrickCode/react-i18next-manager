import { Button } from "~/core/button";
import { DeleteTranslationsReqBodyDto } from "~/core/codegen";
import { LABELS } from "~/core/constants";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "~/core/modal";
import { KEY, LINK, TOAST_MESSAGE, useMutation } from "~/core/react-query";
import { Text } from "~/core/text";

type DeleteTranslationModalProps = ModalProps & {
  handleSelectedIds: (ids: string[]) => void;
  ids: string[];
  selectedGroupId: string;
};

export const DeleteTranslationModal = ({
  handleSelectedIds,
  ids,
  isOpen,
  onClose,
  selectedGroupId,
}: DeleteTranslationModalProps) => {
  const { mutate: deleteTranslations } =
    useMutation<DeleteTranslationsReqBodyDto>({
      refetchQueryKeys: [[KEY.GET_TRANSLATIONS(selectedGroupId)]],
      toastMessage: TOAST_MESSAGE.DELETE_TRANSLATIONS,
    });

  const handleSubmit = () => {
    deleteTranslations({
      link: LINK.DELETE_TRANSLATIONS,
      method: "post",
      body: {
        translations: ids.map((id) => ({ id })),
      },
    });
    onClose();
    handleSelectedIds([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <Text>Delete Translations</Text>
      </ModalHeader>
      <ModalBody>
        <Text>Are you sure you want to delete?</Text>
      </ModalBody>
      <ModalFooter onClose={onClose}>
        <Button colorScheme="red" onClick={handleSubmit}>
          {LABELS.DELETE}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
