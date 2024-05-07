import {
  ButtonGroup,
  Flex,
  IconButton,
  Input,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useModals } from "@saas-ui/react";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

import { Button } from "@core/button";
import { useMutation, useQuery } from "@core/tanstack-react-query";

type Config = {
  id?: number;
  prevName: string;
  newName?: string;
};

type ConfigManagementModalBodyProps = {
  configKind: "groups" | "languages";
};

export const ConfigManagementModalBody = ({
  configKind,
}: ConfigManagementModalBodyProps) => {
  const fontColor = useColorModeValue("gray.800", "white");
  const { data, error, isLoading } = useQuery<string[]>(
    `/config/${configKind}`,
    `get${configKind.toUpperCase()}InModal`
  );
  const modals = useModals();
  const { mutate } = useMutation({
    refetchQueryKey: [`get${configKind.toUpperCase()}InModal`],
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
    <VStack align="baseline">
      {configs
        .filter((config) => config.prevName !== "")
        .map((config, idx) => (
          <Flex key={idx} gap={2} width="full">
            <Input
              color={fontColor}
              value={config.newName}
              onChange={(e) => {
                const newConfigs = [...configs];
                newConfigs[idx].newName = e.target.value;
                setConfigs(newConfigs);
              }}
            />
            <IconButton
              aria-label="delete"
              icon={<FaTrash />}
              onClick={() => {
                modals.confirm({
                  title: <Text color={fontColor}>Delete Confirmation</Text>,
                  body: (
                    <Text color={fontColor}>
                      Are you sure you want to delete this{" "}
                      {configKind === "groups" ? "group" : "language"}?
                    </Text>
                  ),
                  confirmProps: {
                    colorScheme: "red",
                    children: "Delete",
                  },
                  onConfirm: () => {
                    mutate({
                      link: `/config/${configKind}/${config.prevName}`,
                      method: "delete",
                    });
                  },
                });
              }}
            />
          </Flex>
        ))}
      {configs
        .filter((config) => config.prevName === "")
        .map((config) => (
          <Flex key={config.id} gap={2} width="full">
            <Input
              color={fontColor}
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
              aria-label="delete"
              icon={<FaTrash />}
              onClick={() => {
                const newConfigs = configs.filter((c) => c.id !== config.id);
                setConfigs(newConfigs);
              }}
            />
          </Flex>
        ))}
      <Button
        variant="outline"
        width="full"
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
      >
        +
      </Button>
      <ButtonGroup
        display="flex"
        justifyContent="flex-end"
        marginTop={5}
        width="full"
      >
        <Button onClick={() => modals.closeAll()}>Close</Button>
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
          Save
        </Button>
      </ButtonGroup>
    </VStack>
  );
};
