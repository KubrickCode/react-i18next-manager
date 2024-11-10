import { SchemaDto } from "~/core/codegen";
import { TreeData } from "./group-treeview-node";

const buildTree = ({
  groups,
  parentId,
}: {
  groups: SchemaDto<"GetGroupsResDto">["groups"];
  parentId: string | null;
}): TreeData[] => {
  return groups
    .filter((group) => group.parentId === parentId)
    .sort((a, b) => a.position - b.position)
    .map(({ id, label }) => ({
      id,
      label,
      children: buildTree({ groups, parentId: id }),
    }));
};

export const convertGroupsToTreeData = (
  groups: SchemaDto<"GetGroupsResDto">["groups"]
): TreeData[] => {
  return buildTree({ groups, parentId: null });
};
