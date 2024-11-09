import { useState } from "react";
import { FaEdit, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { MdArrowDropDown, MdArrowRight } from "react-icons/md";

import { IconButton } from "~/core/button";
import { EditGroupLabelReqBodyDto } from "~/core/codegen";
import { useColorModeValue } from "~/core/color-mode";
import { z } from "~/core/form";
import { i18nKeys, useTranslation } from "~/core/i18n";
import { Input } from "~/core/input";
import { Box, Flex } from "~/core/layout";
import { DeleteModal, ModalToggle } from "~/core/modal";
import { KEY, useMutation } from "~/core/react-query";
import { Text } from "~/core/text";
import { NodeRendererProps } from "~/core/tree";
import { replaceBlank } from "~/core/utils";

import { AddGroupModal } from "./add-group-modal";

const schema = z.object({
  newLabel: z.string(),
});

export type TreeData = {
  id: string;
  label: string;
  children?: TreeData[];
};

type GroupTreeviewNodeProps = NodeRendererProps<TreeData> & {
  needsMutation: boolean;
  handleSelectedGroup: (
    group: {
      id: string;
      label: string;
    } | null
  ) => void;
};

export const GroupTreeviewNode = ({
  needsMutation,
  node,
  tree,
  dragHandle,
  handleSelectedGroup,
}: GroupTreeviewNodeProps) => {
  const { t } = useTranslation();
  const [label, setLabel] = useState(node.data.label);
  const [isHovered, setIsHovered] = useState(false);

  const treeNodeBgColor = useColorModeValue(
    "rgba(0, 0, 0, 0.1)",
    "rgba(255, 255, 255, 0.1)"
  );
  const inputBgColor = useColorModeValue("white", "gray.800");

  const refetchQueryKeys = [[KEY.GET_GROUPS]];
  const { mutate: editGroupLabel } = useMutation<EditGroupLabelReqBodyDto>({
    refetchQueryKeys,
    schema,
    toast: t(i18nKeys.group.editGroupLabelSuccess),
  });

  const handleEdit = () => {
    editGroupLabel({
      endpoint: {
        path: "/api/groups/label/{id}",
        params: { id: node.data.id },
      },
      method: "patch",
      body: { newLabel: label },
    });
    node.submit(label);
    node.select();
  };

  return (
    <Box
      _hover={{ backgroundColor: treeNodeBgColor }}
      ref={needsMutation ? dragHandle : undefined}
      alignItems="center"
      backgroundColor={node.state.isSelected ? treeNodeBgColor : "transparent"}
      borderRadius={5}
      cursor="pointer"
      display="flex"
      gap={2}
      height={45}
      onClick={() => node.isInternal && node.toggle()}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      paddingLeft={`${(node.level + 1) * 1}rem`}
      paddingRight="0.5rem"
      width="full"
    >
      <Flex alignContent="flex-start" alignItems="center" width="full">
        {node.isEditing ? (
          <Input
            autoFocus
            backgroundColor={inputBgColor}
            onBlur={handleEdit}
            onChange={(e) => setLabel(replaceBlank(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setLabel(node.data.label);
                node.reset();
              }
              if (e.key === "Enter") handleEdit();
            }}
            size="sm"
            value={label}
          />
        ) : (
          <>
            <Text marginBottom={1}>{node.data.label}</Text>
            {node.data.children &&
              node.data.children.length > 0 &&
              (node.isOpen ? <MdArrowDropDown /> : <MdArrowRight />)}
          </>
        )}
      </Flex>

      {needsMutation && (
        <Flex>
          {(node.isSelected || isHovered) && (
            <>
              {node.isEditing ? (
                <IconButton
                  aria-label="save-edit"
                  icon={<FaSave />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                  }}
                  size="xs"
                  variant="ghost"
                />
              ) : (
                <IconButton
                  aria-label="edit"
                  icon={<FaEdit />}
                  onClick={(e) => {
                    e.stopPropagation();
                    node.edit();
                  }}
                  size="xs"
                  variant="ghost"
                />
              )}
              <ModalToggle
                modal={AddGroupModal}
                modalProps={{
                  parentId: node.id,
                  parentName: node.data.label,
                }}
              >
                <IconButton
                  aria-label="add"
                  icon={<FaPlus />}
                  size="xs"
                  variant="ghost"
                />
              </ModalToggle>
              <ModalToggle
                modal={DeleteModal}
                modalProps={{
                  body: <Text>{t(i18nKeys.common.deleteConfirmMessage)}</Text>,
                  endpoint: {
                    path: "/api/groups/{id}",
                    params: { id: node.id },
                  },
                  onComplete() {
                    tree.delete(node.id);
                    tree.select(null);
                    handleSelectedGroup(null);
                  },
                  refetchQueryKeys,
                  toast: t(i18nKeys.group.deleteGroupSuccess),
                }}
              >
                <IconButton
                  aria-label="delete"
                  icon={<FaTrash />}
                  size="xs"
                  variant="ghost"
                />
              </ModalToggle>
            </>
          )}
        </Flex>
      )}
    </Box>
  );
};
