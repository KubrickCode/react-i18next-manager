import { Sidebar, SidebarSection } from "~/core/sidebar";
import { GroupTreeView } from "~/core/tree-view";

import { useLayoutContext } from "./context";
import { convertGroupsToTreeData } from "./utils";
import { Button } from "~/core/button";
import { Flex, Image, useColorModeValue } from "@chakra-ui/react";
import { LABELS } from "~/core/constants";
import { SettingButton } from "./setting";

type Group = {
  key: string;
  children?: Group[];
};

export const LayoutSidebar = () => {
  const { handleSelectedGroup } = useLayoutContext();
  const darkModeImageSrc = useColorModeValue("logo-light.png", "logo-dark.png");
  const groups: Group[] = [
    {
      key: "common",
    },
    {
      key: "title",
      children: [{ key: "main" }],
    },
    {
      key: "error",
      children: [
        {
          key: "field",
        },
        {
          key: "server",
          children: [
            {
              key: "internal",
            },
            {
              key: "external",
            },
            {
              key: "timeout",
            },
          ],
        },
      ],
    },
  ];

  const treeData = convertGroupsToTreeData(groups);

  return (
    <Sidebar width="20rem">
      <SidebarSection>
        <Flex alignItems="center" justifyContent="space-between">
          <Button
            leftIcon={
              <Image
                boxSize="3rem"
                objectFit="cover"
                src={darkModeImageSrc}
                alt="logo"
              />
            }
            onClick={() => (location.href = "/")}
            variant="none"
          >
            {LABELS.APP_TITLE}
          </Button>
          <SettingButton />
        </Flex>
      </SidebarSection>
      <SidebarSection>
        <GroupTreeView data={treeData} onNodeSelect={handleSelectedGroup} />
      </SidebarSection>
    </Sidebar>
  );
};
