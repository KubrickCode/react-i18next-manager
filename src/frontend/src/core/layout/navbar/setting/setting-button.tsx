import { IoIosSettings } from "react-icons/io";
import {
  ButtonGroup,
  IconButton,
  Input,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";

import { Menu, MenuButton, MenuItem, MenuList } from "@core/menu";
import { useModals } from "@saas-ui/react";
import { useMutation, useQuery } from "@core/tanstack-react-query";
import { useEffect, useState } from "react";
import { Button } from "@core/button";

export const SettingButton = () => {
  const { toggleColorMode } = useColorMode();
  const modals = useModals();

  const darkModeIcon = useColorModeValue(
    <MdDarkMode size="1rem" />,
    <CiLight color="white" size="1rem" />
  );
  const darkModeLabel = useColorModeValue("Dark Mode", "Light Mode");
  const fontColor = useColorModeValue("gray.800", "white");

  return (
    <Menu>
      <MenuButton
        aria-label="setting-menu-button"
        as={IconButton}
        icon={<IoIosSettings />}
        size="sm"
        variant="outline"
      />
      <MenuList>
        <MenuItem
          closeOnSelect={false}
          icon={darkModeIcon}
          onClick={() => toggleColorMode()}
        >
          <Text>{darkModeLabel}</Text>
        </MenuItem>
        <MenuItem
          onClick={() =>
            modals.open({
              title: <Text color={fontColor}>Group Management</Text>,
              body: <GroupManagementModalBody fontColor={fontColor} />,
            })
          }
        >
          Group Management
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

type Groups = {
  prevName: string;
  newName?: string;
};

const GroupManagementModalBody = ({ fontColor }: { fontColor: string }) => {
  const { data, error, isLoading } = useQuery<string[]>(
    "/config/groups",
    "getGroupsInModal"
  );
  const modals = useModals();
  const { mutate } = useMutation({
    refetchQueryKey: ["getGroupsInModal"],
  });
  const [groups, setGroups] = useState<Groups[]>([]);

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
      {groups.map((group, idx) => (
        <Input
          key={idx}
          color={fontColor}
          value={group.newName}
          onChange={(e) => {
            const newGroups = [...groups];
            newGroups[idx].newName = e.target.value;
            setGroups(newGroups);
          }}
        />
      ))}
      <ButtonGroup display="flex" justifyContent="flex-end" width="full">
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
