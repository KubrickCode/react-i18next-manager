import { GetTranslationsResDto } from "~/core/codegen";
import { Table, Tbody, Th, Thead, Tr } from "~/core/table";
import { LINK, useQuery } from "~/core/react-query";
import { useLayoutContext } from "~/layout/context";

import { TranslationsTableRow } from "./translations-table-row";
import { Checkbox } from "~/core/checkbox";
import { GET_TRANSLATIONS } from "~/core/react-query/keys";

type TranslationsTableProps = {
  handleSelectedIds: (ids: string[]) => void;
  selectedIds: string[];
};

export const TranslationsTable = ({
  handleSelectedIds,
  selectedIds,
}: TranslationsTableProps) => {
  const { locales, selectedGroup } = useLayoutContext();

  const { data, error, isLoading } = useQuery<GetTranslationsResDto>(
    LINK.GET_TRANSLATIONS(selectedGroup?.id ?? ""),
    GET_TRANSLATIONS(selectedGroup?.id ?? "")
  );

  if (locales.length < 1) return null;
  if (!data) return <>ERROR</>;
  if (error) return <>{error.message}</>;
  if (isLoading) return <>Loading...</>;

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
