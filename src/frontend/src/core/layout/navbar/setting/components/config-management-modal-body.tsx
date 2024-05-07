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

type Group = {
  id?: number;
  prevName: string;
  newName?: string;
};

type ConfigManagementModalBodyProps = {
  configKind: string;
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
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (data) {
      const newGroups = data.map((group) => ({
        prevName: group,
        newName: group,
      }));
      setGroups(newGroups);
    }
  }, [data]);

  if (!groups) return <>ERROR</>;
  if (error) return <>{error.message}</>;
  if (isLoading) return <>Loading...</>;

  return (
    <VStack align="baseline">
      {groups
        .filter((group) => group.prevName !== "")
        .map((group, idx) => (
          <Flex key={idx} gap={2} width="full">
            <Input
              color={fontColor}
              value={group.newName}
              onChange={(e) => {
                const newGroups = [...groups];
                newGroups[idx].newName = e.target.value;
                setGroups(newGroups);
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
                      Are you sure you want to delete this group?
                    </Text>
                  ),
                  confirmProps: {
                    colorScheme: "red",
                    children: "Delete",
                  },
                  onConfirm: () => {
                    mutate({
                      link: `/config/groups/${group.prevName}`,
                      method: "delete",
                    });
                  },
                });
              }}
            />
          </Flex>
        ))}
      {groups
        .filter((group) => group.prevName === "")
        .map((group) => (
          <Flex key={group.id} gap={2} width="full">
            <Input
              color={fontColor}
              value={group.newName}
              onChange={(e) => {
                const newGroups = [...groups];
                const groupIndex = newGroups.findIndex(
                  (g) => g.id === group.id
                );
                if (groupIndex !== -1) {
                  newGroups[groupIndex].newName = e.target.value;
                }
                setGroups(newGroups);
              }}
            />
            <IconButton
              aria-label="delete"
              icon={<FaTrash />}
              onClick={() => {
                const newGroups = groups.filter((g) => g.id !== group.id);
                setGroups(newGroups);
              }}
            />
          </Flex>
        ))}
      <Button
        variant="outline"
        width="full"
        onClick={() => {
          setGroups((prev) => [
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
              link: "/config/groups",
              method: "put",
              body: groups,
            })
          }
        >
          Save
        </Button>
      </ButtonGroup>
    </VStack>
  );
};
