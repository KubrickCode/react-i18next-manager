import { Sidebar, SidebarSection } from "~/core/sidebar";
import { GroupTreeView } from "~/core/tree-view";

import { useLayoutContext } from "../context";
import { convertGroupsToTreeData } from "../utils";
import { Button } from "~/core/button";
import { Flex, Image, useColorModeValue } from "@chakra-ui/react";
import { LABELS } from "~/core/constants";
import { SettingButton } from "./setting-button";
import { useQuery } from "~/core/tanstack-react-query";

type Group = {
  key: string;
  children?: Group[];
};

export const LayoutSidebar = () => {
  const { handleSelectedGroup } = useLayoutContext();
  const darkModeImageSrc = useColorModeValue("logo-light.png", "logo-dark.png");
  const { data } = useQuery<Group[]>("/config/groups", "getGroups");

  if (!data) return null;

  const treeData = convertGroupsToTreeData(data);

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
