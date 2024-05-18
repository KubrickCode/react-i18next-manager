import { GetGroupsResDto } from "~/core/codegen";

import { TreeData } from "./sidebar/layout-sidebar-group-treeview";

export const convertGroupsToTreeData = (
  groups: GetGroupsResDto["groups"]
): TreeData[] => {
  return groups.map(({ id, label, children }) => {
    return {
      id,
      label,
      children: convertGroupsToTreeData(children),
    };
  });
};
