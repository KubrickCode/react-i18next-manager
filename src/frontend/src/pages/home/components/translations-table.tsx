import { GetTranslationsResDto } from "~/core/codegen";
import { Table, Tbody, Th, Thead, Tr } from "~/core/table";
import { useQuery } from "~/core/react-query";

import { TranslationsTableRow } from "./translations-table-row";

type TranslationsTableProps = {
  locales: {
    id: string;
    label: string;
  }[];
  selectedGroupId: string;
};

export const TranslationsTable = ({
  locales,
  selectedGroupId,
}: TranslationsTableProps) => {
  const queryKey = `getTranslations-${selectedGroupId}}`;
  const { data, error, isLoading } = useQuery<GetTranslationsResDto>(
    `/translations/${selectedGroupId}`,
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
          <TranslationsTableRow locales={locales} translation={translation} />
        ))}
      </Tbody>
    </Table>
  );
};
