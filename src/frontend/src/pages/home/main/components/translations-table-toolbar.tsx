import { IoMdRefresh } from "react-icons/io";
import { MdDriveFileMove } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import assert from "assert";

import { Button, IconButton } from "~/core/button";
import { ModalToggle } from "~/core/modal";
import { buildApiPath, useQueryClient } from "~/core/react-query";
import { useApp } from "~/core/app";
import { i18nKeys, useTranslation } from "~/core/i18n";
import { LocaleManagementModal } from "~/shared/locale";

import { AddTranslationModal } from "./add-translation-modal";
import { DeleteTranslationModal } from "./delete-translations-modal";
import { useHomePageContext } from "../../context";
import { MoveTranslationsGroupModal } from "./move-translations-group-modal";
import { HStack, useColorModeValue } from "@chakra-ui/react";
import { SearchInput } from "@saas-ui/react";

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
  const { t } = useTranslation();
  const { locales } = useApp();
  const { selectedGroup } = useHomePageContext();
  assert(selectedGroup);
  const queryClient = useQueryClient();
  const moveGroupButtonColorScheme = useColorModeValue("gray", "darkgray");

  if (!selectedGroup) return null;

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: [
        buildApiPath({
          path: "/api/translations/{groupId}",
          params: { groupId: selectedGroup?.id ?? "" },
        }),
      ],
    });
  };

  if (locales.length < 1)
    return (
      <ModalToggle modal={LocaleManagementModal}>
        <Button size="sm" textDecoration="underline" variant="link">
          {t(i18nKeys.setting.emptyLocaleMessage)}
        </Button>
      </ModalToggle>
    );

  return (
    <HStack marginTop={2}>
      {selectedIds.length > 0 && (
        <>
          <ModalToggle
            modal={DeleteTranslationModal}
            modalProps={{
              ids: selectedIds,
              onComplete() {
                handleSelectedIds([]);
              },
              selectedGroupId: selectedGroup.id,
            }}
          >
            <Button colorScheme="red" leftIcon={<FaTrash />} size="sm">
              {t(i18nKeys.translation.deleteTranslationsRows, {
                count: selectedIds.length,
              })}
            </Button>
          </ModalToggle>
          <ModalToggle
            modal={MoveTranslationsGroupModal}
            modalProps={{
              currentGroup: selectedGroup,
              onComplete() {
                handleSelectedIds([]);
              },
              translationIds: selectedIds,
            }}
          >
            <Button
              colorScheme={moveGroupButtonColorScheme}
              leftIcon={<MdDriveFileMove />}
              size="sm"
            >
              {t(i18nKeys.group.moveGroup)}
            </Button>
          </ModalToggle>
        </>
      )}
      <IconButton
        aria-label="refresh"
        icon={<IoMdRefresh />}
        onClick={() => handleRefresh()}
        size="sm"
      />
      <ModalToggle modal={AddTranslationModal} modalProps={{ selectedGroup }}>
        <Button size="sm">{t(i18nKeys.translation.addTranslation)}</Button>
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
