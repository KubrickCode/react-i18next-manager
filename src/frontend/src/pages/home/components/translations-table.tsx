import { useState } from "react";

import { GetTranslationsResDto } from "~/core/codegen";
import { Table, Tbody, Th, Thead, Tr } from "~/core/table";
import { useQuery } from "~/core/react-query";
import { useLayoutContext } from "~/layout/context";

import { TranslationsTableRow } from "./translations-table-row";
import { Checkbox } from "~/core/checkbox";

export const TranslationsTable = () => {
  const { locales, selectedGroup } = useLayoutContext();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const queryKey = `getTranslations-${selectedGroup?.id}}`;
  const { data, error, isLoading } = useQuery<GetTranslationsResDto>(
    `/translations/${selectedGroup?.id}`,
    queryKey
  );

  if (!data) return <>ERROR</>;
  if (error) return <>{error.message}</>;
  if (isLoading) return <>Loading...</>;

  const { translations } = data;

  const handleSelectAll = () => {
    if (selectedIds.length === translations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(translations.map((translation) => translation.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  return (
    <Table layout="fixed" size="sm">
      <Thead>
        <Tr>
          <Th width="3%">
            <Checkbox
              isChecked={selectedIds.length === translations.length}
              isIndeterminate={
                selectedIds.length > 0 &&
                selectedIds.length < translations.length
              }
              onChange={handleSelectAll}
            />
          </Th>
          <Th paddingY={3}>KEY</Th>
          {locales.map((locale) => (
            <Th key={locale.id}>{locale.label.toUpperCase()}</Th>
          ))}
          <Th />
        </Tr>
      </Thead>
      <Tbody>
        {translations.map((translation) => (
          <TranslationsTableRow
            key={translation.id}
            isSelected={selectedIds.includes(translation.id)}
            onSelect={() => handleSelect(translation.id)}
            translation={translation}
          />
        ))}
      </Tbody>
    </Table>
  );
};
