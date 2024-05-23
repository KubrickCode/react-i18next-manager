import { IoMdRefresh } from "react-icons/io";

import { Button, IconButton } from "~/core/button";
import { SearchInput } from "~/core/input";
import { Flex, HStack } from "~/core/layout";
import { ModalToggle } from "~/core/modal";
import { useQueryClient } from "~/core/react-query";
import { useLayoutContext } from "~/layout/context";
import { Text } from "~/core/text";
import { AddLocaleModal } from "~/shared/add-locale-modal";

import { AddTranslationModal } from "./add-translation-modal";
import { DeleteTranslationModal } from "./delete-translations-modal";

type TranslationsTableToolbarProps = {
  handleSelectedIds: (ids: string[]) => void;
  selectedIds: string[];
};

export const TranslationsTableToolbar = ({
  handleSelectedIds,
  selectedIds,
}: TranslationsTableToolbarProps) => {
  const { locales, selectedGroup } = useLayoutContext();

  const queryClient = useQueryClient();

  const handleRefresh = () => {
    selectedGroup &&
      queryClient.invalidateQueries({
        queryKey: [`getTranslations-${selectedGroup.id}}`],
      });
  };

  if (locales.length < 1)
    return (
      <Flex alignItems="center" gap={2}>
        <Text>Please</Text>
        <ModalToggle modal={AddLocaleModal} modalProps={{ position: 0 }}>
          <Button size="sm" textDecoration="underline" variant="link">
            Add Locale
          </Button>
        </ModalToggle>
        <Text>First</Text>
      </Flex>
    );

  return (
    <HStack marginTop={2}>
      {selectedIds.length > 0 && (
        <ModalToggle
          modal={DeleteTranslationModal}
          modalProps={{ handleSelectedIds, ids: selectedIds }}
        >
          <Button colorScheme="red" size="sm">
            Delete {selectedIds.length} rows
          </Button>
        </ModalToggle>
      )}
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
