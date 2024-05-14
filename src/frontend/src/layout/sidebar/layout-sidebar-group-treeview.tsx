import { useState } from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { SearchInput } from "@saas-ui/react";
import { FaEdit, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { MdArrowDropDown, MdArrowRight } from "react-icons/md";

import { useQuery } from "~/core/tanstack-react-query";
import { NodeRendererProps, Tree } from "~/core/tree";
import { Input } from "~/core/input";
import { Text } from "~/core/text";
import { IconButton } from "~/core/button";

import { useLayoutContext } from "../context";
import { convertGroupsToTreeData } from "../utils";

type Group = {
  key: string;
  children?: Group[];
};

export const LayoutSidebarGroupTreeView = () => {
  const { handleSelectedGroup } = useLayoutContext();
  const { data } = useQuery<Group[]>("/config/groups", "getGroups");
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
          node.data.name.toLowerCase().includes(term.toLowerCase())
        }
      >
        {Node}
      </Tree>
    </VStack>
  );
};

type TreeData = {
  id: string;
  name: string;
  children?: TreeData[];
};

const Node = ({ node, tree }: NodeRendererProps<TreeData>) => {
  const [input, setInput] = useState(node.data.name);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      _hover={{ backgroundColor: "gray.700" }}
      alignItems="center"
      backgroundColor={node.state.isSelected ? "gray.700" : "transparent"}
      cursor="pointer"
      display="flex"
      height={45}
      onClick={() => node.isInternal && node.toggle()}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      paddingLeft={`${(node.level + 1) * 2}rem`}
      width="full"
    >
      {node.isEditing ? (
        <Input onChange={(e) => setInput(e.target.value)} value={input} />
      ) : (
        <Flex alignContent="flex-start" alignItems="center" width="full">
          <Text>{node.data.name}</Text>
          {node.data.children &&
            (node.isOpen ? <MdArrowDropDown /> : <MdArrowRight />)}
        </Flex>
      )}
      {(node.isSelected || isHovered) &&
        (node.isEditing ? (
          <IconButton
            aria-label="save-edit"
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
          icon={<FaTrash />}
          onClick={(e) => {
            e.stopPropagation();
            tree.delete(node.id);
          }}
          size="xs"
          variant="ghost"
        />
      )}
    </Box>
  );
};
