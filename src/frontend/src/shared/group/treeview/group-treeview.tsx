import { useState } from "react";
import { FaPlus } from "react-icons/fa";

import { useMutation, ENDPOINT, KEY } from "~/core/react-query";
import { Tree } from "~/core/tree";
import { SearchInput } from "~/core/input";
import { Text } from "~/core/text";
import { IconButton } from "~/core/button";
import { ModalToggle } from "~/core/modal";
import { Box, Flex, VStack } from "~/core/layout";
import { useColorModeValue } from "~/core/color-mode";
import { EditGroupPositionReqBodyDto, GetGroupsResDto } from "~/core/codegen";
import { i18nKeys, useTranslation } from "~/core/i18n";
import { z } from "~/core/form";

import { convertGroupsToTreeData } from "./utils";
import { AddGroupModal } from "./add-group-modal";
import { GroupTreeviewNode } from "./group-treeview-node";

const schema = z.object({
  position: z.number().int(),
});

type GroupTreeViewProps = {
  groups: GetGroupsResDto["groups"];
  handleSelectedGroup: (
    group: {
      id: string;
      label: string;
    } | null
  ) => void;
  needsMutation?: boolean;
  height: number;
  width: number;
};

export const GroupTreeView = ({
  groups,
  handleSelectedGroup,
  needsMutation = false,
  height,
  width,
}: GroupTreeViewProps) => {
  const [term, setTerm] = useState("");
  const treeNodeBgColor = useColorModeValue(
    "rgba(0, 0, 0, 0.1)",
    "rgba(255, 255, 255, 0.1)"
  );
  const { t } = useTranslation();

  const refetchQueryKeys = [[KEY.GET_GROUPS]];
  const { mutate: editGroupPosition } =
    useMutation<EditGroupPositionReqBodyDto>({
      refetchQueryKeys,
      schema,
      toastMessage: t(i18nKeys.group.editGroupPositionSuccess),
    });

  const treeData = convertGroupsToTreeData(groups);

  return (
    <VStack alignItems="baseline">
      <SearchInput
        onChange={(e) => setTerm(e.target.value)}
        onReset={() => setTerm("")}
        size="sm"
        value={term}
      />
      <Box
        _hover={{ backgroundColor: treeNodeBgColor }}
        alignItems="center"
        borderRadius={5}
        padding={2}
        width="full"
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="xs">{t(i18nKeys.group.groupList)}</Text>
          {needsMutation && (
            <ModalToggle
              modal={AddGroupModal}
              modalProps={{
                parentId: null,
                parentName: "Root",
              }}
            >
              <IconButton
                aria-label="add"
                icon={<FaPlus />}
                size="xs"
                variant="ghost"
              />
            </ModalToggle>
          )}
        </Flex>
      </Box>
      <Tree
        data={treeData}
        openByDefault={false}
        height={height}
        indent={24}
        onMove={({ dragIds, index: position }) => {
          editGroupPosition({
            link: ENDPOINT.EDIT_GROUP_POSITION(dragIds[0]),
            method: "patch",
            body: { position },
          });
        }}
        onSelect={(nodes) =>
          handleSelectedGroup(
            nodes[0]?.data
              ? {
                  id: nodes[0].data.id,
                  label: nodes[0].data.label,
                }
              : null
          )
        }
        rowHeight={45}
        searchTerm={term}
        searchMatch={(node, term) => node.data.label.includes(term)}
        width={width}
      >
        {(nodeProps) => (
          <GroupTreeviewNode
            {...nodeProps}
            handleSelectedGroup={handleSelectedGroup}
            needsMutation={needsMutation}
          />
        )}
      </Tree>
    </VStack>
  );
};
