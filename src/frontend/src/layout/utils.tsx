import { TreeData } from "~/core/tree-view";

type Group = {
  key: string;
  children?: Group[];
};

export const convertGroupsToTreeData = (
  groups: Group[],
  parentKey?: string
): TreeData[] => {
  return groups.map((group) => {
    const newKey = parentKey ? `${parentKey}.${group.key}` : group.key;
    const children = group.children
      ? convertGroupsToTreeData(group.children, newKey)
      : undefined;
    return {
      id: newKey,
      name: group.key,
      children,
    };
  });
};
