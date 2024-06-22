import { useState } from "react";
import { FaRegEdit, FaSave, FaTrash } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";

import {
  DeleteModal,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
  ModalToggle,
} from "~/core/modal";
import { useMutation, LINK, KEY, TOAST_MESSAGE } from "~/core/react-query";
import { Text } from "~/core/text";
import { Button, IconButton } from "~/core/button";
import { Input } from "~/core/input";
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
import { AddLocaleModal } from "~/shared/add-locale-modal";
import { useApp } from "~/core/app";
import { i18nKeys, useTranslation } from "~/core/i18n";

type LocaleManagementModalProps = ModalProps;

export const LocaleManagementModal = ({
  isOpen,
  onClose,
}: LocaleManagementModalProps) => {
  const { t } = useTranslation();
  const { locales } = useApp();

  const refetchQueryKeys = [[KEY.GET_LOCALES]];
  const [editMode, setEditMode] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState<{
    id: string;
    newLabel: string;
  }>({
    id: "",
    newLabel: "",
  });

  const { mutate: editLocalesPosition } =
    useMutation<EditLocalesPositionReqBodyDto>({
      refetchQueryKeys,
      toastMessage: TOAST_MESSAGE.EDIT_LOCALES_POSITION,
    });

  const { mutate: editLocaleLabel } = useMutation<EditLocaleLabelReqBodyDto>({
    refetchQueryKeys,
    toastMessage: TOAST_MESSAGE.EDIT_LOCALE_LABEL,
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
      link: LINK.EDIT_LOCALES_POSITION,
      method: "patch",
      body: {
        locales: updatedLocales,
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <Text>{t(i18nKeys.setting.localeManagement)}</Text>
      </ModalHeader>
      <ModalBody>
        <DragDropContext onDragEnd={onDrag}>
          <Droppable direction="vertical" droppableId="locales">
            {(provided) => (
              <Box ref={provided.innerRef} {...provided.droppableProps}>
                {locales.map((locale, idx) => {
                  const isEditMode =
                    editMode && selectedLocale.id === locale.id;
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
                                  <Input
                                    size="sm"
                                    onChange={(e) =>
                                      setSelectedLocale((prev) => ({
                                        ...prev,
                                        newLabel: e.target.value,
                                      }))
                                    }
                                    value={selectedLocale.newLabel}
                                  />
                                ) : (
                                  <Text marginBottom={1}>{locale.label}</Text>
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
                                        editLocaleLabel({
                                          link: LINK.EDIT_LOCALE_LABEL(
                                            selectedLocale.id
                                          ),
                                          method: "patch",
                                          body: {
                                            newLabel: selectedLocale.newLabel,
                                          },
                                        });
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
                                      setSelectedLocale({
                                        id: locale.id,
                                        newLabel: locale.label,
                                      });
                                    }}
                                  />
                                )}
                                {!isEditMode && (
                                  <ModalToggle
                                    modal={DeleteModal}
                                    modalProps={{
                                      body: (
                                        <Text>
                                          Are you sure you want to delete?
                                        </Text>
                                      ),
                                      link: LINK.DELETE_LOCALE(locale.id),
                                      refetchQueryKeys,
                                      toastMessage: TOAST_MESSAGE.DELETE_LOCALE,
                                    }}
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
        <ModalToggle
          modal={AddLocaleModal}
          modalProps={{
            position: locales.length,
          }}
        >
          <Button border="1px dotted lightgray" variant="outline" width="full">
            +
          </Button>
        </ModalToggle>
      </ModalBody>
      <ModalFooter onClose={onClose} />
    </Modal>
  );
};
