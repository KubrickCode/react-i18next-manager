import { useState } from "react";
import { Box, Flex, VStack, useColorModeValue } from "@chakra-ui/react";
import { SearchInput } from "@saas-ui/react";
import { FaEdit, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { MdArrowDropDown, MdArrowRight } from "react-icons/md";

import { useMutation, useQuery } from "~/core/tanstack-react-query";
import { NodeRendererProps, Tree } from "~/core/tree";
import { Input } from "~/core/input";
import { Text } from "~/core/text";
import { IconButton } from "~/core/button";
import { GetGroupsResDto } from "~/core/codegen";
import { DeleteModal, ModalToggle } from "~/core/modal";

import { useLayoutContext } from "../context";
import { convertGroupsToTreeData } from "../utils";
import { AddGroupModal } from "./add-group-modal";

export const LayoutSidebarGroupTreeView = () => {
  const { handleSelectedGroup } = useLayoutContext();
  const { data } = useQuery<GetGroupsResDto["groups"]>("/groups", "getGroups");
  const [term, setTerm] = useState("");
  const treeNodeBgColor = useColorModeValue("gray.100", "gray.700");

  if (!data) return null;

  const treeData = convertGroupsToTreeData(data);

  return (
    <VStack alignItems="baseline">
      <SearchInput onChange={(e) => setTerm(e.target.value)} size="sm" />
      <Box
        _hover={{ backgroundColor: treeNodeBgColor }}
        alignItems="center"
        borderRadius={5}
        padding={2}
        width="full"
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="xs">Groups</Text>
          <ModalToggle
            modal={AddGroupModal}
            modalProps={{
              parentId: null,
              parentName: "Root",
            }}
          >
            <IconButton
              aria-label="add"
              colorScheme="gray"
              icon={<FaPlus />}
              size="xs"
              variant="ghost"
            />
          </ModalToggle>
        </Flex>
      </Box>
      <Tree
        initialData={treeData}
        openByDefault={false}
        height={1000}
        indent={24}
        onSelect={(nodes) => handleSelectedGroup(nodes[0]?.data.id || null)}
        rowHeight={45}
        searchTerm={term}
        searchMatch={(node, term) =>
          node.data.label.toLowerCase().includes(term.toLowerCase())
        }
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

const Node = ({ node, tree }: NodeRendererProps<TreeData>) => {
  const [label, setLabel] = useState(node.data.label);
  const [isHovered, setIsHovered] = useState(false);

  const treeNodeBgColor = useColorModeValue("gray.100", "gray.700");
  const inputBgColor = useColorModeValue("white", "gray.800");

  const refetchQueryKeys = [["getGroups"]];
  const { mutate } = useMutation({
    refetchQueryKeys,
  });

  return (
    <Box
      _hover={{ backgroundColor: treeNodeBgColor }}
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
      paddingLeft={`${(node.level + 1) * 1.5}rem`}
      paddingRight="0.5rem"
      width="full"
    >
      <Flex alignContent="flex-start" alignItems="center" width="full">
        {node.isEditing ? (
          <Input
            autoFocus
            backgroundColor={inputBgColor}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") node.reset();
              if (e.key === "Enter") {
                mutate({
                  link: `/groups/label/${node.data.id}`,
                  method: "patch",
                  body: { newLabel: label },
                });
                node.submit(label);
                node.select();
              }
            }}
            size="sm"
            value={label}
          />
        ) : (
          <>
            <Text>{label}</Text>
            {node.data.children &&
              node.data.children.length > 0 &&
              (node.isOpen ? <MdArrowDropDown /> : <MdArrowRight />)}
          </>
        )}
      </Flex>

      <Flex>
        {(node.isSelected || isHovered) &&
          (node.isEditing ? (
            <IconButton
              aria-label="save-edit"
              colorScheme="gray"
              icon={<FaSave />}
              onClick={(e) => {
                e.stopPropagation();
                mutate({
                  link: `/groups/label/${node.data.id}`,
                  method: "patch",
                  body: { newLabel: label },
                });
                node.submit(label);
                node.select();
              }}
              size="xs"
              variant="ghost"
            />
          ) : (
            <IconButton
              aria-label="edit"
              colorScheme="gray"
              icon={<FaEdit />}
              onClick={(e) => {
                e.stopPropagation();
                node.edit();
              }}
              size="xs"
              variant="ghost"
            />
          ))}
        {node.isSelected && (
          <ModalToggle
            modal={AddGroupModal}
            modalProps={{
              parentId: node.id,
              parentName: node.data.label,
              onComplete() {
                tree.reset();
              },
            }}
          >
            <IconButton
              aria-label="add"
              colorScheme="gray"
              icon={<FaPlus />}
              size="xs"
              variant="ghost"
            />
          </ModalToggle>
        )}
        {(node.isSelected || isHovered) && (
          <ModalToggle
            modal={DeleteModal}
            modalProps={{
              body: <Text>Are you sure you want to delete?</Text>,
              link: `/groups/${node.id}`,
              refetchQueryKeys,
              onComplete() {
                tree.delete(node.id);
              },
            }}
          >
            <IconButton
              aria-label="delete"
              colorScheme="gray"
              icon={<FaTrash />}
              size="xs"
              variant="ghost"
            />
          </ModalToggle>
        )}
      </Flex>
    </Box>
  );
};
