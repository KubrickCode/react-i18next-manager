import { useApp } from "~/core/app";
import { AddTranslationReqBodyDto } from "~/core/codegen";
import {
  Input,
  Field,
  Fields,
  MutationForm,
  SubmitButton,
  z,
  Label,
} from "~/core/form";
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
import { replaceBlank } from "~/core/utils";

const schema = z.object({
  key: z.string(),
  values: z.array(
    z.object({
      localeId: z.string().uuid(),
      value: z.string(),
    })
  ),
});

type AddTranslationModalProps = ModalProps & {
  selectedGroup: {
    id: string;
    label: string;
  };
};

export const AddTranslationModal = ({
  isOpen,
  onClose,
  selectedGroup,
}: AddTranslationModalProps) => {
  const { t } = useTranslation();
  const { locales } = useApp();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <MutationForm<AddTranslationReqBodyDto>
        endpoint={ENDPOINT.ADD_TRANSLATION(selectedGroup.id)}
        method="post"
        onComplete={onClose}
        refetchQueryKeys={[[KEY.GET_TRANSLATIONS(selectedGroup.id)]]}
        schema={schema}
        toast={t(i18nKeys.translation.addTranslationSuccess)}
      >
        {({ setValue }) => (
          <>
            <ModalHeader>
              <Text>{t(i18nKeys.translation.addTranslation)}</Text>
            </ModalHeader>
            <ModalBody>
              <Fields>
                <Field>
                  <Label>{t(i18nKeys.common.group)}</Label>
                  <Text fontWeight="bold">{selectedGroup.label}</Text>
                </Field>
                <Field>
                  <Label>{t(i18nKeys.common.key)}</Label>
                  <Input
                    name="key"
                    onChange={(e) =>
                      setValue("key", replaceBlank(e.target.value))
                    }
                  />
                </Field>
                {locales.map((locale, index) => (
                  <Field key={locale.id}>
                    <Label>{locale.label}</Label>
                    <Input
                      name={`values.${index}.value`}
                      onChange={(e) =>
                        setValue(`values.${index}`, {
                          localeId: locale.id,
                          value: e.target.value,
                        })
                      }
                    />
                  </Field>
                ))}
              </Fields>
            </ModalBody>
            <ModalFooter onClose={onClose}>
              <SubmitButton />
            </ModalFooter>
          </>
        )}
      </MutationForm>
    </Modal>
  );
};
