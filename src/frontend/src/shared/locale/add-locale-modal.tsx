import { AddLocaleReqBodyDto } from "~/core/codegen";
import {
  Field,
  Label,
  MutationForm,
  z,
  Input,
  SubmitButton,
} from "~/core/form";
import { i18nKeys, useTranslation } from "~/core/i18n";
import { ModalBody, ModalFooter, ModalHeader, useModal } from "~/core/modal";
import { KEY, ENDPOINT } from "~/core/react-query";
import { Text } from "~/core/text";

const schema = z.object({
  label: z.string(),
});

export const AddLocaleModal = () => {
  const { t } = useTranslation();
  const { onClose } = useModal();

  return (
    <MutationForm<AddLocaleReqBodyDto>
      endpoint={ENDPOINT.ADD_LOCALE}
      method="post"
      onComplete={onClose}
      refetchQueryKeys={[[KEY.GET_LOCALES]]}
      schema={schema}
      toast={t(i18nKeys.setting.addLocaleSuccess)}
    >
      <ModalHeader>
        <Text>{t(i18nKeys.setting.addLocale)}</Text>
      </ModalHeader>
      <ModalBody>
        <Field>
          <Label>{t(i18nKeys.setting.newLocale)}</Label>
          <Input name="label" />
        </Field>
      </ModalBody>
      <ModalFooter>
        <SubmitButton />
      </ModalFooter>
    </MutationForm>
  );
};
