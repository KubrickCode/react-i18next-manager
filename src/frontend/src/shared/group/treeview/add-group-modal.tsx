import { AddGroupReqBodyDto } from "~/core/codegen";
import {
  Field,
  Fields,
  Label,
  MutationForm,
  SubmitButton,
  z,
  Input,
} from "~/core/form";
import { i18nKeys, useTranslation } from "~/core/i18n";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "~/core/modal";
import { ENDPOINT, KEY } from "~/core/react-query";
import { Text } from "~/core/text";
import { replaceBlank } from "~/core/utils";

const schema = z.object({
  label: z.string(),
  parentId: z.string().uuid().nullable(),
});

type AddGroupModalProps = ModalProps & {
  parentId: string | null;
  parentName: string;
};

export const AddGroupModal = ({
  isOpen,
  onClose,
  parentId,
  parentName,
}: AddGroupModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <MutationForm<AddGroupReqBodyDto>
        defaultValues={{ parentId }}
        endpoint={ENDPOINT.ADD_GROUP}
        method="post"
        onComplete={onClose}
        refetchQueryKeys={[[KEY.GET_GROUPS]]}
        schema={schema}
        toast={t(i18nKeys.group.addGroupSuccess)}
      >
        {({ setValue }) => (
          <>
            <ModalHeader>
              <Text>{t(i18nKeys.group.addGroup)}</Text>
            </ModalHeader>
            <ModalBody>
              <Fields>
                <Field>
                  <Label>{t(i18nKeys.group.parentGroup)}</Label>
                  <Text fontWeight="bold">{parentName}</Text>
                </Field>
                <Field>
                  <Label>{t(i18nKeys.group.newGroup)}</Label>
                  <Input
                    name="label"
                    placeholder={t(i18nKeys.group.groupName)}
                    onChange={(e) =>
                      setValue("label", replaceBlank(e.target.value))
                    }
                  />
                </Field>
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
