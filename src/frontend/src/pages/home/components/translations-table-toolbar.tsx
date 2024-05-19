import { IoMdRefresh } from "react-icons/io";

import { Button, IconButton } from "~/core/button";
import { SearchInput } from "~/core/input";
import { HStack } from "~/core/layout";
import { ModalToggle } from "~/core/modal";
import { useQueryClient } from "~/core/react-query";
import { useLayoutContext } from "~/layout/context";

import { AddTranslationModal } from "./add-translation-modal";

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
      <ModalToggle modal={AddTranslationModal}>
        <Button size="sm">Add Key</Button>
      </ModalToggle>
      <SearchInput size="sm" width="auto" />
    </HStack>
  );
};
