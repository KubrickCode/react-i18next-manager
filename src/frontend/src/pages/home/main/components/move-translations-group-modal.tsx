import {
  EditTranslationsParentGroupReqBodyDto,
  GetGroupsResDto,
} from "~/core/codegen";
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
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "~/core/modal";
import { KEY, ENDPOINT, useSuspenseQuery } from "~/core/react-query";
import { Text } from "~/core/text";
import { GroupTreeView } from "~/shared/group";

type Group = {
  id: string;
  label: string;
};

type MoveTranslationsGroupModalProps = ModalProps & {
  currentGroup: Group;
  onComplete: () => void;
  translationIds: string[];
};

export const MoveTranslationsGroupModal = ({
  currentGroup,
  isOpen,
  onClose,
  onComplete,
  translationIds,
}: MoveTranslationsGroupModalProps) => {
  const { t } = useTranslation();
  const { data } = useSuspenseQuery<GetGroupsResDto>(
    ENDPOINT.GET_GROUPS,
    KEY.GET_GROUPS_IN_MOVE_GROUP_MODAL
  );

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
    <Modal isOpen={isOpen} onClose={onClose}>
      <MutationForm<EditTranslationsParentGroupReqBodyDto>
        defaultValues={{
          translations: translationIds.map((id) => ({ id })),
        }}
        endpoint={ENDPOINT.EDIT_TRANSLATIONS_PARENT_GROUP}
        method="patch"
        onComplete={handleComplete}
        refetchQueryKeys={[[KEY.GET_TRANSLATIONS(currentGroup.id)]]}
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
            <ModalFooter onClose={onClose}>
              <SubmitButton />
            </ModalFooter>
          </>
        )}
      </MutationForm>
    </Modal>
  );
};
