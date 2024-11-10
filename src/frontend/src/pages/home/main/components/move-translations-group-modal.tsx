import { SchemaDto } from "~/core/codegen";
import {
  Field,
  FieldError,
  Fields,
  Label,
  MutationForm,
  SubmitButton,
  z,
} from "~/core/form";
import { i18nKeys, useTranslation } from "~/core/i18n";
import { ModalBody, ModalFooter, ModalHeader, useModal } from "~/core/modal";
import { buildApiPath, useSuspenseQuery } from "~/core/react-query";
import { Text } from "~/core/text";
import { GroupTreeView } from "~/shared/group";

type Group = {
  id: string;
  label: string;
};

type MoveTranslationsGroupModalProps = {
  currentGroup: Group;
  onComplete: () => void;
  translationIds: string[];
};

export const MoveTranslationsGroupModal = ({
  currentGroup,
  onComplete,
  translationIds,
}: MoveTranslationsGroupModalProps) => {
  const { t } = useTranslation();
  const { data } =
    useSuspenseQuery<SchemaDto<"GetGroupsResDto">>("/api/groups");
  const { onClose } = useModal();

  const { groups } = data;

  const handleComplete = () => {
    onClose();
    onComplete();
  };

  const schema = z.object({
    translations: z.array(
      z.object({
        id: z.string().uuid(),
      })
    ),
    newGroupId: z
      .string({ message: t(i18nKeys.group.selectTargetGroupEmptyError) })
      .uuid(),
  });

  return (
    <MutationForm<SchemaDto<"EditTranslationsParentGroupReqBodyDto">>
      defaultValues={{
        translations: translationIds.map((id) => ({ id })),
      }}
      endpoint={"/api/translations/group"}
      method="patch"
      onComplete={handleComplete}
      refetchQueryKeys={[
        [
          buildApiPath({
            path: "/api/translations/{groupId}",
            params: { groupId: currentGroup.id },
          }),
        ],
      ]}
      schema={schema}
      toast={t(i18nKeys.group.moveGroupSuccess)}
    >
      {({ setValue }) => (
        <>
          <ModalHeader>
            <Text>{t(i18nKeys.group.moveGroup)}</Text>
          </ModalHeader>
          <ModalBody>
            <Fields>
              <Field>
                <Label>{t(i18nKeys.group.currentGroup)}</Label>
                <Text fontWeight="bold">{currentGroup.label}</Text>
              </Field>
              <Field>
                <Label>{t(i18nKeys.group.selectTargetGroup)}</Label>
                <GroupTreeView
                  groups={groups}
                  handleSelectedGroup={(group) => {
                    if (group) setValue("newGroupId", group.id);
                  }}
                  height={300}
                  width={400}
                />
                <FieldError name="newGroupId" />
              </Field>
            </Fields>
          </ModalBody>
          <ModalFooter>
            <SubmitButton />
          </ModalFooter>
        </>
      )}
    </MutationForm>
  );
};
