import { HStack } from "@chakra-ui/react";
import { SearchInput } from "@saas-ui/react";
import { IoMdRefresh } from "react-icons/io";

import { Button, IconButton } from "~/core/button";

export const TranslationsTableToolbar = () => {
  return (
    <HStack marginTop={2}>
      <IconButton aria-label="refresh" icon={<IoMdRefresh />} size="sm" />
      <Button size="sm">Add Key</Button>
      <SearchInput size="sm" width="auto" />
    </HStack>
  );
};
