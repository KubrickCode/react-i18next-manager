import { useSuspenseQuery } from "~/core/react-query";
import { Checkbox } from "~/core/checkbox";
import { Text } from "~/core/text";
import { useApp } from "~/core/app";
import { i18nKeys, useTranslation } from "~/core/i18n";

import { useHomePageContext } from "../../context";
import { TranslationsTableRow } from "./translations-table-row";
import { SchemaDto } from "~/core/codegen";
import { Center, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

type TranslationsTableProps = {
  handleSelectedIds: (ids: string[]) => void;
  selectedIds: string[];
  term: string;
};

export const TranslationsTable = ({
  handleSelectedIds,
  selectedIds,
  term,
}: TranslationsTableProps) => {
  const { locales } = useApp();
  const { selectedGroup } = useHomePageContext();
  const { t } = useTranslation();

  const { data } = useSuspenseQuery<SchemaDto<"GetTranslationsResDto">>({
    path: "/api/translations/{groupId}",
    params: { groupId: selectedGroup?.id ?? "" },
  });

  if (locales.length < 1) return null;

  const { translations } = data;

  const handleSelectAll = () => {
    if (selectedIds.length === translations.length) {
      handleSelectedIds([]);
    } else {
      handleSelectedIds(translations.map((translation) => translation.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      handleSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      handleSelectedIds([...selectedIds, id]);
    }
  };

  const hasTranslations = translations.length > 0;

  return (
    <Table layout="fixed" size="sm">
      <Thead>
        <Tr>
          <Th width="3%">
            <Checkbox
              isChecked={
                hasTranslations && selectedIds.length === translations.length
              }
              isDisabled={!hasTranslations}
              isIndeterminate={
                selectedIds.length > 0 &&
                selectedIds.length < translations.length
              }
              onChange={handleSelectAll}
            />
          </Th>
          <Th paddingY={3}>{t(i18nKeys.common.key)}</Th>
          {locales.map((locale) => (
            <Th key={locale.id}>{locale.label.toUpperCase()}</Th>
          ))}
          <Th />
        </Tr>
      </Thead>
      <Tbody>
        {hasTranslations ? (
          translations
            .filter((translation) => {
              const key = translation.key.toLowerCase();
              const values = translation.values.map((value) =>
                value.value.toLowerCase()
              );
              return (
                key.includes(term.toLowerCase()) ||
                values.some((val) => val.includes(term.toLowerCase()))
              );
            })
            .map((translation) => (
              <TranslationsTableRow
                key={translation.id}
                isSelected={selectedIds.includes(translation.id)}
                onSelect={() => handleSelect(translation.id)}
                term={term}
                translation={translation}
              />
            ))
        ) : (
          <Tr>
            <Td colSpan={locales.length + 3}>
              <Center padding={20}>
                <Text color="gray.500" fontSize="sm">
                  {t(i18nKeys.translation.noTranslations)}
                </Text>
              </Center>
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};
