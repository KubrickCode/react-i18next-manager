import { Tree, NodeRendererProps } from "react-arborist";
import { MdArrowDropDown, MdArrowRight } from "react-icons/md";
import { Flex, VStack } from "@chakra-ui/react";

import { Button } from "../button";
import { Text } from "../text";
import { useState } from "react";
import { SearchInput } from "@saas-ui/react";

export type TreeData = {
  id: string;
  name: string;
  children?: TreeData[];
};

type TreeViewProps = {
  data: TreeData[];
  onNodeSelect: (key: string | null) => void;
};

export const GroupTreeView = ({ data, onNodeSelect }: TreeViewProps) => {
  const [term, setTerm] = useState("");

  return (
    <VStack>
      <SearchInput onChange={(e) => setTerm(e.target.value)} size="sm" />
      <Tree
        initialData={data}
        openByDefault={false}
        height={1000}
        indent={24}
        onSelect={(nodes) => onNodeSelect(nodes[0]?.data.id || null)}
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

const Node = ({ node }: NodeRendererProps<TreeData>) => {
  return (
    <Button
      backgroundColor={node.state.isSelected ? "gray.700" : "transparent"}
      paddingLeft={`${(node.level + 1) * 2}rem`}
      onClick={() => node.isInternal && node.toggle()}
      width="full"
    >
      <Flex alignContent="flex-start" alignItems="center" width="full">
        <Text>{node.data.name}</Text>
        {node.data.children &&
          (node.isOpen ? <MdArrowDropDown /> : <MdArrowRight />)}
      </Flex>
    </Button>
  );
};
