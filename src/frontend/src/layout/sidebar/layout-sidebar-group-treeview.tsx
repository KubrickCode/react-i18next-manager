import { useState } from "react";
import { Box, Flex, VStack, useColorModeValue } from "@chakra-ui/react";
import { SearchInput } from "@saas-ui/react";
import { FaEdit, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { MdArrowDropDown, MdArrowRight } from "react-icons/md";

import { useQuery } from "~/core/tanstack-react-query";
import { NodeRendererProps, Tree } from "~/core/tree";
import { Input } from "~/core/input";
import { Text } from "~/core/text";
import { IconButton } from "~/core/button";
import { GetGroupsResDto } from "~/core/codegen";

import { useLayoutContext } from "../context";
import { convertGroupsToTreeData } from "../utils";

export const LayoutSidebarGroupTreeView = () => {
  const { handleSelectedGroup } = useLayoutContext();
  const { data } = useQuery<GetGroupsResDto["groups"]>("/groups", "getGroups");
  const [term, setTerm] = useState("");

  if (!data) return null;

  const treeData = convertGroupsToTreeData(data);

  return (
    <VStack>
      <SearchInput onChange={(e) => setTerm(e.target.value)} size="sm" />
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
  const [input, setInput] = useState(node.data.label);
  const [isHovered, setIsHovered] = useState(false);

  const treeNodeBgColor = useColorModeValue("gray.100", "gray.700");
  const inputBgColor = useColorModeValue("white", "gray.800");

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
            onChange={(e) => setInput(e.target.value)}
            size="sm"
            value={input}
          />
        ) : (
          <>
            <Text>{node.data.label}</Text>
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
                node.submit(input);
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
          <IconButton
            aria-label="add"
            colorScheme="gray"
            icon={<FaPlus />}
            onClick={(e) => {
              e.stopPropagation();
              tree.createInternal();
            }}
            size="xs"
            variant="ghost"
          />
        )}
        {(node.isSelected || isHovered) && (
          <IconButton
            aria-label="delete"
            colorScheme="gray"
            icon={<FaTrash />}
            onClick={(e) => {
              e.stopPropagation();
              tree.delete(node.id);
            }}
            size="xs"
            variant="ghost"
          />
        )}
      </Flex>
    </Box>
  );
};
