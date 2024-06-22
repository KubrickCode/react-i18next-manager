import { useState } from "react";
import { FaEdit, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { MdArrowDropDown, MdArrowRight } from "react-icons/md";

import { useMutation, LINK, KEY } from "~/core/react-query";
import { NodeRendererProps, Tree } from "~/core/tree";
import { Input, SearchInput } from "~/core/input";
import { Text } from "~/core/text";
import { IconButton } from "~/core/button";
import { DeleteModal, ModalToggle } from "~/core/modal";
import { Box, Flex, VStack } from "~/core/layout";
import { useColorModeValue } from "~/core/color-mode";
import {
  EditGroupLabelReqBodyDto,
  EditGroupPositionReqBodyDto,
} from "~/core/codegen";
import { replaceBlank } from "~/core/utils";
import { i18nKeys, useTranslation } from "~/core/i18n";

import { convertGroupsToTreeData } from "./utils";
import { AddGroupModal } from "./add-group-modal";
import { useHomePageContext } from "../../context";
import { t } from "i18next";

export const GroupTreeView = () => {
  const { groups, handleSelectedGroup } = useHomePageContext();
  const [term, setTerm] = useState("");
  const treeNodeBgColor = useColorModeValue("gray.100", "gray.700");
  const { t } = useTranslation();

  const refetchQueryKeys = [[KEY.GET_GROUPS]];
  const { mutate: editGroupPosition } =
    useMutation<EditGroupPositionReqBodyDto>({
      refetchQueryKeys,
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
          <Text fontSize="xs">{t(i18nKeys.common.groups)}</Text>
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
        </Flex>
      </Box>
      <Tree
        data={treeData}
        openByDefault={false}
        height={1000}
        indent={24}
        onMove={({ dragIds, index: position }) => {
          editGroupPosition({
            link: LINK.EDIT_GROUP_POSITION(dragIds[0]),
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
      >
        {Node}
      </Tree>
    </VStack>
  );
};

export type TreeData = {
  id: string;
  label: string;
  children?: TreeData[];
};

const Node = ({ node, tree, dragHandle }: NodeRendererProps<TreeData>) => {
  const { handleSelectedGroup } = useHomePageContext();
  const [label, setLabel] = useState(node.data.label);
  const [isHovered, setIsHovered] = useState(false);

  const treeNodeBgColor = useColorModeValue("gray.100", "gray.700");
  const inputBgColor = useColorModeValue("white", "gray.800");

  const refetchQueryKeys = [[KEY.GET_GROUPS]];
  const { mutate: editGroupLabel } = useMutation<EditGroupLabelReqBodyDto>({
    refetchQueryKeys,
    toastMessage: t(i18nKeys.group.editGroupLabelSuccess),
  });

  const handleEdit = () => {
    editGroupLabel({
      link: LINK.EDIT_GROUP_LABEL(node.data.id),
      method: "patch",
      body: { newLabel: label },
    });
    node.submit(label);
    node.select();
  };

  return (
    <Box
      _hover={{ backgroundColor: treeNodeBgColor }}
      ref={dragHandle}
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
                link: LINK.DELETE_GROUP(node.id),
                refetchQueryKeys,
                toastMessage: t(i18nKeys.group.deleteGroupSuccess),
                onComplete() {
                  tree.delete(node.id);
                  tree.select(null);
                  handleSelectedGroup(null);
                },
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
    </Box>
  );
};
