import { Highlight as ChakraHighlight, HighlightProps } from "@chakra-ui/react";

export const Highlight = (props: HighlightProps) => (
  <ChakraHighlight styles={{ bg: "orange.100" }} {...props} />
);
