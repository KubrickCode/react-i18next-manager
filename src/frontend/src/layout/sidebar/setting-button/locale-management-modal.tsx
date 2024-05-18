import { Flex, IconButton, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

import { Button } from "~/core/button";
import { LABELS } from "~/core/constants";
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
import { Input } from "~/core/input";
import { Text } from "~/core/text";
import { GetLocalesResDto } from "~/core/codegen";

type Locales = {
  id?: string;
  prevLabel: string;
  newLabel: string;
};

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
  const { mutate } = useMutation({
    refetchQueryKeys,
  });
  const [locales, setLocales] = useState<Locales[]>([]);

  useEffect(() => {
    if (data) {
      console.log(data);
      setLocales(
        data.locales.map(({ id, label }) => ({
          id,
          prevLabel: label,
          newLabel: label,
        }))
      );
    }
  }, [data]);

  if (!data) return <>ERROR</>;
  if (error) return <>{error.message}</>;
  if (isLoading) return <>Loading...</>;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <Text>Locale Management</Text>
      </ModalHeader>
      <ModalBody>
        <VStack>
          {locales
            .filter((locale) => locale.prevLabel !== "")
            .map((locale, idx) => (
              <Flex key={idx} gap={2} width="full">
                <Input
                  value={locale.newLabel}
                  onChange={(e) => {
                    const newLocales = [...locales];
                    newLocales[idx].newLabel = e.target.value;
                    setLocales(newLocales);
                  }}
                />
                <ModalToggle
                  modal={DeleteModal}
                  modalProps={{
                    body: (
                      <Text>Are you sure you want to delete this locale?</Text>
                    ),
                    link: `/locales/${locale.id}`,
                    refetchQueryKeys,
                  }}
                >
                  <IconButton aria-label={LABELS.DELETE} icon={<FaTrash />} />
                </ModalToggle>
              </Flex>
            ))}
          {locales
            .filter((locale) => locale.prevLabel === "")
            .map((locale) => (
              <Flex key={locale.id} gap={2} width="full">
                <Input
                  value={locale.newLabel}
                  onChange={(e) => {
                    const newLocales = [...locales];
                    const localeIndex = newLocales.findIndex(
                      (c) => c.id === locale.id
                    );
                    if (localeIndex !== -1) {
                      newLocales[localeIndex].newLabel = e.target.value;
                    }
                    setLocales(newLocales);
                  }}
                />
                <IconButton
                  aria-label={LABELS.DELETE}
                  icon={<FaTrash />}
                  onClick={() => {
                    const newLocales = locales.filter(
                      (c) => c.id !== locale.id
                    );
                    setLocales(newLocales);
                  }}
                />
              </Flex>
            ))}
          <Flex justifyContent="flex-end" width="full">
            <IconButton
              aria-label={LABELS.PLUS}
              icon={<FaPlus />}
              onClick={() => {
                setLocales((prev) => [
                  ...prev,
                  {
                    prevLabel: "",
                    newLabel: "",
                  },
                ]);
              }}
            />
          </Flex>
        </VStack>
      </ModalBody>
      <ModalFooter onClose={onClose}>
        <Button colorScheme="primary">{LABELS.SAVE}</Button>
      </ModalFooter>
    </Modal>
  );
};
