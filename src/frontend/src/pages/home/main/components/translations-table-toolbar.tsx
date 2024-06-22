import { IoMdRefresh } from "react-icons/io";

import { Button, IconButton } from "~/core/button";
import { SearchInput } from "~/core/input";
import { HStack } from "~/core/layout";
import { ModalToggle } from "~/core/modal";
import { KEY, useQueryClient } from "~/core/react-query";
import { LocaleManagementModal } from "~/shared/locale-management-modal";
import { useApp } from "~/core/app";

import { AddTranslationModal } from "./add-translation-modal";
import { DeleteTranslationModal } from "./delete-translations-modal";
import { useHomePageContext } from "../../context";

type TranslationsTableToolbarProps = {
  handleSelectedIds: (ids: string[]) => void;
  handleTerm: (term: string) => void;
  selectedIds: string[];
};

export const TranslationsTableToolbar = ({
  handleSelectedIds,
  handleTerm,
  selectedIds,
}: TranslationsTableToolbarProps) => {
  const { locales } = useApp();
  const { selectedGroup } = useHomePageContext();
  const queryClient = useQueryClient();

  if (!selectedGroup) return null;

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: [KEY.GET_TRANSLATIONS(selectedGroup?.id ?? "")],
    });
  };

  if (locales.length < 1)
    return (
      <ModalToggle modal={LocaleManagementModal}>
        <Button size="sm" textDecoration="underline" variant="link">
          Please Add Locale First
        </Button>
      </ModalToggle>
    );

  return (
    <HStack marginTop={2}>
      {selectedIds.length > 0 && (
        <ModalToggle
          modal={DeleteTranslationModal}
          modalProps={{
            handleSelectedIds,
            ids: selectedIds,
            selectedGroupId: selectedGroup.id,
          }}
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
      <ModalToggle
        modal={AddTranslationModal}
        modalProps={{
          selectedGroup,
        }}
      >
        <Button size="sm">Add Key</Button>
      </ModalToggle>
      <SearchInput
        size="sm"
        width="auto"
        onChange={(e) => handleTerm(e.target.value)}
        onReset={() => handleTerm("")}
      />
    </HStack>
  );
};
