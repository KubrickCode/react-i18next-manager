import { Sidebar, SidebarSection } from "~/core/sidebar";
import { GroupTreeView } from "~/core/tree-view";

import { useLayoutContext } from "./context";
import { convertGroupsToTreeData } from "./utils";

type Group = {
  key: string;
  children?: Group[];
};

export const LayoutSidebar = () => {
  const { handleSelectedGroup } = useLayoutContext();
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
    <Sidebar>
      <SidebarSection width="20rem">
        <GroupTreeView data={treeData} onNodeSelect={handleSelectedGroup} />
      </SidebarSection>
    </Sidebar>
  );
};
