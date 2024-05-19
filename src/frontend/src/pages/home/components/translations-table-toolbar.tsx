import { IoMdRefresh } from "react-icons/io";

import { Button, IconButton } from "~/core/button";
import { SearchInput } from "~/core/input";
import { HStack } from "~/core/layout";

export const TranslationsTableToolbar = () => {
  return (
    <HStack marginTop={2}>
      <IconButton aria-label="refresh" icon={<IoMdRefresh />} size="sm" />
      <Button size="sm">Add Key</Button>
      <SearchInput size="sm" width="auto" />
    </HStack>
  );
};
