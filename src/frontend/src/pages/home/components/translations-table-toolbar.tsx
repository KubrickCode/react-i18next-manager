import { IoMdRefresh } from "react-icons/io";

import { Button, IconButton } from "~/core/button";
import { SearchInput } from "~/core/input";
import { HStack } from "~/core/layout";
import { useQueryClient } from "~/core/react-query";
import { useLayoutContext } from "~/layout/context";

export const TranslationsTableToolbar = () => {
  const { selectedGroup } = useLayoutContext();

  const queryClient = useQueryClient();

  const handleRefresh = () => {
    selectedGroup &&
      queryClient.invalidateQueries({
        queryKey: [`getTranslations-${selectedGroup.id}}`],
      });
  };

  return (
    <HStack marginTop={2}>
      <IconButton
        aria-label="refresh"
        icon={<IoMdRefresh />}
        onClick={() => handleRefresh()}
        size="sm"
      />
      <Button size="sm">Add Key</Button>
      <SearchInput size="sm" width="auto" />
    </HStack>
  );
};
