import { Flex, IconButton, VStack } from "@chakra-ui/react";
import _ from "lodash";
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

type Config = {
  id?: number;
  prevName: string;
  newName?: string;
};

type LocaleManagementModalProps = ModalProps & {
  configKind: "groups" | "languages";
};

export const LocaleManagementModal = ({
  configKind,
  isOpen,
  onClose,
}: LocaleManagementModalProps) => {
  const upperFirstConfigKind = _.upperFirst(configKind);
  const { data, error, isLoading } = useQuery<string[]>(
    `/config/${configKind}`,
    `get${upperFirstConfigKind}InModal`
  );
  const { mutate } = useMutation({
    refetchQueryKeys: [
      [`get${upperFirstConfigKind}InModal`],
      [`get${upperFirstConfigKind}`],
    ],
  });
  const [configs, setConfigs] = useState<Config[]>([]);

  useEffect(() => {
    if (data) {
      const newConfigs = data.map((config) => ({
        prevName: config,
        newName: config,
      }));
      setConfigs(newConfigs);
    }
  }, [data]);

  if (!configs) return <>ERROR</>;
  if (error) return <>{error.message}</>;
  if (isLoading) return <>Loading...</>;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <Text>{`Manage ${upperFirstConfigKind}`}</Text>
      </ModalHeader>
      <ModalBody>
        <VStack>
          {configs
            .filter((config) => config.prevName !== "")
            .map((config, idx) => (
              <Flex key={idx} gap={2} width="full">
                <Input
                  value={config.newName}
                  onChange={(e) => {
                    const newConfigs = [...configs];
                    newConfigs[idx].newName = e.target.value;
                    setConfigs(newConfigs);
                  }}
                />
                <ModalToggle
                  modal={DeleteModal}
                  modalProps={{
                    body: (
                      <Text>
                        Are you sure you want to delete this{" "}
                        {configKind === "groups" ? "group" : "language"}?
                      </Text>
                    ),
                    link: `/config/${configKind}/${config.prevName}`,
                    refetchQueryKeys: [
                      [`get${upperFirstConfigKind}InModal`],
                      [`get${upperFirstConfigKind}`],
                    ],
                  }}
                >
                  <IconButton aria-label={LABELS.DELETE} icon={<FaTrash />} />
                </ModalToggle>
              </Flex>
            ))}
          {configs
            .filter((config) => config.prevName === "")
            .map((config) => (
              <Flex key={config.id} gap={2} width="full">
                <Input
                  value={config.newName}
                  onChange={(e) => {
                    const newConfigs = [...configs];
                    const configIndex = newConfigs.findIndex(
                      (c) => c.id === config.id
                    );
                    if (configIndex !== -1) {
                      newConfigs[configIndex].newName = e.target.value;
                    }
                    setConfigs(newConfigs);
                  }}
                />
                <IconButton
                  aria-label={LABELS.DELETE}
                  icon={<FaTrash />}
                  onClick={() => {
                    const newConfigs = configs.filter(
                      (c) => c.id !== config.id
                    );
                    setConfigs(newConfigs);
                  }}
                />
              </Flex>
            ))}
          <Flex justifyContent="flex-end" width="full">
            <IconButton
              aria-label={LABELS.PLUS}
              icon={<FaPlus />}
              onClick={() => {
                setConfigs((prev) => [
                  ...prev,
                  {
                    id: prev.length,
                    prevName: "",
                    newName: "",
                  },
                ]);
              }}
            />
          </Flex>
        </VStack>
      </ModalBody>
      <ModalFooter onClose={onClose}>
        <Button
          colorScheme="primary"
          onClick={() =>
            mutate({
              link: `/config/${configKind}`,
              method: "put",
              body: configs,
            })
          }
        >
          {LABELS.SAVE}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
