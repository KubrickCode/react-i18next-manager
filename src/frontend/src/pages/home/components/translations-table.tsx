import { GetTranslationsResDto } from "~/core/codegen";
import { Table, Tbody, Th, Thead, Tr } from "~/core/table";
import { useQuery } from "~/core/react-query";
import { useLayoutContext } from "~/layout/context";

import { TranslationsTableRow } from "./translations-table-row";

export const TranslationsTable = () => {
  const { locales, selectedGroup } = useLayoutContext();

  const queryKey = `getTranslations-${selectedGroup?.id}}`;
  const { data, error, isLoading } = useQuery<GetTranslationsResDto>(
    `/translations/${selectedGroup?.id}`,
    queryKey
  );

  if (!data) return <>ERROR</>;
  if (error) return <>{error.message}</>;
  if (isLoading) return <>Loading...</>;

  const { translations } = data;

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>KEY</Th>
          {locales.map((locale) => (
            <Th key={locale.id}>{locale.label.toUpperCase()}</Th>
          ))}
          <Th />
        </Tr>
      </Thead>
      <Tbody>
        {translations.map((translation) => (
          <TranslationsTableRow translation={translation} />
        ))}
      </Tbody>
    </Table>
  );
};
