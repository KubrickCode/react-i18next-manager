import { Button } from "~/core/button";
import { DeleteTranslationsReqBodyDto } from "~/core/codegen";
import { i18nKeys, useTranslation } from "~/core/i18n";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "~/core/modal";
import { KEY, LINK, useMutation } from "~/core/react-query";
import { Text } from "~/core/text";

type DeleteTranslationModalProps = ModalProps & {
  ids: string[];
  onComplete: () => void;
  selectedGroupId: string;
};

export const DeleteTranslationModal = ({
  ids,
  isOpen,
  onClose,
  onComplete,
  selectedGroupId,
}: DeleteTranslationModalProps) => {
  const { t } = useTranslation();
  const { mutate: deleteTranslations } =
    useMutation<DeleteTranslationsReqBodyDto>({
      refetchQueryKeys: [[KEY.GET_TRANSLATIONS(selectedGroupId)]],
      toastMessage: t(i18nKeys.translation.deleteTranslationSuccess),
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
    onComplete();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <Text>{t(i18nKeys.translation.deleteTranslations)}</Text>
      </ModalHeader>
      <ModalBody>
        <Text>{t(i18nKeys.common.deleteConfirmMessage)}</Text>
      </ModalBody>
      <ModalFooter onClose={onClose}>
        <Button colorScheme="red" onClick={handleSubmit}>
          {t(i18nKeys.common.delete)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
