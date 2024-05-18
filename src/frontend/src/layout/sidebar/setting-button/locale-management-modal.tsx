import { Fragment, useState } from "react";
import { Box, Divider, Flex } from "@chakra-ui/react";
import { FaRegEdit, FaSave, FaTrash } from "react-icons/fa";

import {
  DeleteModal,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
  ModalToggle,
} from "~/core/modal";
import { useMutation, useQuery } from "~/core/tanstack-react-query";
import { Text } from "~/core/text";
import { GetLocalesResDto } from "~/core/codegen";
import { Button, IconButton } from "~/core/button";
import { Input } from "~/core/input";

type LocaleManagementModalProps = ModalProps;

export const LocaleManagementModal = ({
  isOpen,
  onClose,
}: LocaleManagementModalProps) => {
  const { data, error, isLoading } = useQuery<GetLocalesResDto>(
    "/locales",
    `getLocalesInModal`
  );
  const refetchQueryKeys = [[`getLocalesInModal`], [`getLocales`]];
  const [editMode, setEditMode] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState<{
    id: string;
    newLabel: string;
  }>({
    id: "",
    newLabel: "",
  });

  const { mutate } = useMutation({
    refetchQueryKeys,
  });

  if (!data) return <>ERROR</>;
  if (error) return <>{error.message}</>;
  if (isLoading) return <>Loading...</>;

  const { locales } = data;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <Text>Locale Management</Text>
      </ModalHeader>
      <ModalBody>
        {locales.map((locale, idx) => {
          const isEditMode = editMode && selectedLocale.id === locale.id;
          return (
            <Fragment key={locale.id}>
              <Box padding={3}>
                <Flex
                  alignItems="center"
                  gap={1}
                  justifyContent="space-between"
                >
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
                    <Text>{locale.label}</Text>
                  )}
                  <Flex gap={1}>
                    {isEditMode ? (
                      <Flex gap={1}>
                        <IconButton
                          aria-label="save"
                          size="sm"
                          icon={<FaSave />}
                          onClick={() => {
                            setEditMode(false);
                            mutate({
                              link: `/locales/label/${selectedLocale.id}`,
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
                          body: <Text>Are you sure you want to delete?</Text>,
                          link: `/locales/${locale.id}`,
                          refetchQueryKeys,
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
            </Fragment>
          );
        })}
      </ModalBody>
      <ModalFooter onClose={onClose} />
    </Modal>
  );
};
