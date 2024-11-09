import { DeleteTranslationsReqBodyDto } from "~/core/codegen";
import { MutationForm, SubmitButton, z } from "~/core/form";
import { i18nKeys, useTranslation } from "~/core/i18n";
import { ModalBody, ModalFooter, ModalHeader, useModal } from "~/core/modal";
import { KEY } from "~/core/react-query";
import { Text } from "~/core/text";

const schema = z.object({
  translations: z.array(
    z.object({
      id: z.string().uuid(),
    })
  ),
});

type DeleteTranslationModalProps = {
  ids: string[];
  onComplete: () => void;
  selectedGroupId: string;
};

export const DeleteTranslationModal = ({
  ids,
  onComplete,
  selectedGroupId,
}: DeleteTranslationModalProps) => {
  const { t } = useTranslation();
  const { onClose } = useModal();

  const handleComplete = () => {
    onClose();
    onComplete();
  };

  return (
    <>
      <MutationForm<DeleteTranslationsReqBodyDto>
        defaultValues={{ translations: ids.map((id) => ({ id })) }}
        endpoint="/api/translations/delete"
        method="post"
        onComplete={handleComplete}
        refetchQueryKeys={[[KEY.GET_TRANSLATIONS(selectedGroupId)]]}
        schema={schema}
        toast={t(i18nKeys.translation.deleteTranslationSuccess)}
      >
        <ModalHeader>
          <Text>{t(i18nKeys.translation.deleteTranslations)}</Text>
        </ModalHeader>
        <ModalBody>
          <Text>{t(i18nKeys.common.deleteConfirmMessage)}</Text>
        </ModalBody>
        <ModalFooter>
          <SubmitButton colorScheme="red">
            {t(i18nKeys.common.delete)}
          </SubmitButton>
        </ModalFooter>
      </MutationForm>
    </>
  );
};
