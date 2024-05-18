import { useState } from "react";
import { Box, Divider, Flex } from "@chakra-ui/react";
import { FaRegEdit, FaSave, FaTrash } from "react-icons/fa";

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
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
            <>
              <Box key={locale.id} padding={3}>
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
                      <IconButton
                        aria-label="delete"
                        isDisabled={!!editMode}
                        size="sm"
                        icon={<FaTrash />}
                      />
                    )}
                  </Flex>
                </Flex>
              </Box>
              {idx < locales.length - 1 && <Divider />}
            </>
          );
        })}
      </ModalBody>
      <ModalFooter onClose={onClose} />
    </Modal>
  );
};
