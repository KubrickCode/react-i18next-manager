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
import { useLayoutContext } from "~/layout/context";

type DeleteTranslationModalProps = ModalProps & {
  handleSelectedIds: (ids: string[]) => void;
  ids: string[];
};

export const DeleteTranslationModal = ({
  handleSelectedIds,
  ids,
  isOpen,
  onClose,
}: DeleteTranslationModalProps) => {
  const { selectedGroup } = useLayoutContext();

  const { mutate: deleteTranslations } =
    useMutation<DeleteTranslationsReqBodyDto>({
      refetchQueryKeys: [[KEY.GET_TRANSLATIONS(selectedGroup?.id ?? "")]],
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
