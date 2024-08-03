import { useState } from "react";
import { FaRegEdit, FaSave, FaTrash } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";

import {
  DeleteModal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalToggle,
} from "~/core/modal";
import { useMutation, ENDPOINT, KEY } from "~/core/react-query";
import { Text } from "~/core/text";
import { Button, IconButton } from "~/core/button";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "~/core/drag-drop";
import { Box, Divider, Flex } from "~/core/layout";
import {
  EditLocaleLabelReqBodyDto,
  EditLocalesPositionReqBodyDto,
} from "~/core/codegen";
import { useApp } from "~/core/app";
import { i18nKeys, useTranslation } from "~/core/i18n";
import { MutationForm, z, Input } from "~/core/form";

import { AddLocaleModal } from "./add-locale-modal";

const editLocalesPositionSchema = z.object({
  locales: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number().int(),
    })
  ),
});

const editLocaleLabelSchema = z.object({
  newLabel: z.string(),
});

export const LocaleManagementModal = () => {
  const { t } = useTranslation();
  const { locales } = useApp();

  const refetchQueryKeys = [[KEY.GET_LOCALES]];
  const [editMode, setEditMode] = useState(false);
  const [selectedLocaleId, setSelectedLocaleId] = useState<string>();

  const { mutate: editLocalesPosition } =
    useMutation<EditLocalesPositionReqBodyDto>({
      refetchQueryKeys,
      schema: editLocalesPositionSchema,
      toast: t(i18nKeys.setting.editLocalePositionSuccess),
    });

  const onDrag = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedLocales = Array.from(locales);
    const [movedLocale] = reorderedLocales.splice(result.source.index, 1);
    reorderedLocales.splice(result.destination.index, 0, movedLocale);

    const updatedLocales = reorderedLocales.map((locale, index) => ({
      id: locale.id,
      position: index,
    }));

    editLocalesPosition({
      endpoint: ENDPOINT.EDIT_LOCALES_POSITION,
      method: "patch",
      body: {
        locales: updatedLocales,
      },
    });
  };

  return (
    <>
      <ModalHeader>
        <Text>{t(i18nKeys.setting.localeManagement)}</Text>
      </ModalHeader>
      <ModalBody>
        <DragDropContext onDragEnd={onDrag}>
          <Droppable direction="vertical" droppableId="locales">
            {(provided) => (
              <Box ref={provided.innerRef} {...provided.droppableProps}>
                {locales.map((locale, idx) => {
                  const isEditMode = editMode && selectedLocaleId === locale.id;
                  return (
                    <Draggable
                      key={locale.id}
                      draggableId={locale.id}
                      index={idx}
                    >
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <Box padding={3}>
                            <MutationForm<EditLocaleLabelReqBodyDto>
                              defaultValues={{ newLabel: locale.label }}
                              endpoint={ENDPOINT.EDIT_LOCALE_LABEL(locale.id)}
                              method="patch"
                              refetchQueryKeys={refetchQueryKeys}
                              schema={editLocaleLabelSchema}
                              toast={t(i18nKeys.setting.editLocaleLabelSuccess)}
                            >
                              {({ submit }) => (
                                <Flex
                                  alignItems="center"
                                  gap={1}
                                  justifyContent="space-between"
                                >
                                  <Flex alignItems="center" gap={2}>
                                    <Flex {...provided.dragHandleProps}>
                                      <MdDragIndicator />
                                    </Flex>
                                    {isEditMode ? (
                                      <Input name="newLabel" size="sm" />
                                    ) : (
                                      <Text marginBottom={1}>
                                        {locale.label}
                                      </Text>
                                    )}
                                  </Flex>
                                  <Flex gap={1}>
                                    {isEditMode ? (
                                      <Flex gap={1}>
                                        <IconButton
                                          aria-label="save"
                                          size="sm"
                                          icon={<FaSave />}
                                          onClick={() => {
                                            setEditMode(false);
                                            submit();
                                          }}
                                        />
                                        <Button
                                          onClick={() => {
                                            setEditMode(false);
                                          }}
                                          size="sm"
                                        >
                                          X
                                        </Button>
                                      </Flex>
                                    ) : (
                                      <IconButton
                                        aria-label="edit"
                                        isDisabled={!!editMode}
                                        size="sm"
                                        icon={<FaRegEdit />}
                                        onClick={() => {
                                          setEditMode(true);
                                          setSelectedLocaleId(locale.id);
                                        }}
                                      />
                                    )}
                                    {!isEditMode && (
                                      <ModalToggle
                                        modal={
                                          <DeleteModal
                                            body={
                                              <Text>
                                                {t(
                                                  i18nKeys.common
                                                    .deleteConfirmMessage
                                                )}
                                              </Text>
                                            }
                                            endpoint={ENDPOINT.DELETE_LOCALE(
                                              locale.id
                                            )}
                                            refetchQueryKeys={refetchQueryKeys}
                                            toast={t(
                                              i18nKeys.setting
                                                .deleteLocaleSuccess
                                            )}
                                          />
                                        }
                                      >
                                        <IconButton
                                          aria-label="delete"
                                          isDisabled={!!editMode}
                                          size="sm"
                                          icon={<FaTrash />}
                                        />
                                      </ModalToggle>
                                    )}
                                  </Flex>
                                </Flex>
                              )}
                            </MutationForm>
                          </Box>
                          {idx < locales.length - 1 && <Divider />}
                        </Box>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
        <ModalToggle modal={<AddLocaleModal />}>
          <Button border="1px dotted lightgray" variant="outline" width="full">
            +
          </Button>
        </ModalToggle>
      </ModalBody>
      <ModalFooter />
    </>
  );
};
