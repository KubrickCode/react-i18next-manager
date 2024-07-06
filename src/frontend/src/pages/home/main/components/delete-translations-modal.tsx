import { DeleteTranslationsReqBodyDto } from "~/core/codegen";
import { MutationForm, SubmitButton, z } from "~/core/form";
import { i18nKeys, useTranslation } from "~/core/i18n";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "~/core/modal";
import { KEY, ENDPOINT } from "~/core/react-query";
import { Text } from "~/core/text";

const schema = z.object({
  translations: z.array(
    z.object({
      id: z.string().uuid(),
    })
  ),
});

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

  const handleComplete = () => {
    onClose();
    onComplete();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <MutationForm<DeleteTranslationsReqBodyDto>
        defaultValues={{ translations: ids.map((id) => ({ id })) }}
        endpoint={ENDPOINT.DELETE_TRANSLATIONS}
        method="post"
        onComplete={handleComplete}
        refetchQueryKeys={[[KEY.GET_TRANSLATIONS(selectedGroupId)]]}
        schema={schema}
        toastMessage={t(i18nKeys.translation.deleteTranslationSuccess)}
      >
        <ModalHeader>
          <Text>{t(i18nKeys.translation.deleteTranslations)}</Text>
        </ModalHeader>
        <ModalBody>
          <Text>{t(i18nKeys.common.deleteConfirmMessage)}</Text>
        </ModalBody>
        <ModalFooter onClose={onClose}>
          <SubmitButton colorScheme="red">
            {t(i18nKeys.common.delete)}
          </SubmitButton>
        </ModalFooter>
      </MutationForm>
    </Modal>
  );
};
