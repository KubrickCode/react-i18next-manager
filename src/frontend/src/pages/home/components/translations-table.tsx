import { GetTranslationsResDto } from "~/core/codegen";
import { Table, Tbody, Td, Th, Thead, Tr } from "~/core/table";
import { useQuery } from "~/core/tanstack-react-query";

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
  const queryKey = `getTranslations-${selectedGroupId}-${locales.join("-")}`;
  const {
    data: translations,
    error,
    isLoading,
  } = useQuery<GetTranslationsResDto["translations"]>(
    `/translations/${selectedGroupId}`,
    queryKey
  );

  if (!translations) return <>ERROR</>;
  if (error) return <>{error.message}</>;
  if (isLoading) return <>Loading...</>;

  const translationsByKey = translations.reduce((acc, translation) => {
    if (!acc[translation.key]) {
      acc[translation.key] = {};
    }
    acc[translation.key][translation.localeId] = translation.value;
    return acc;
  }, {} as Record<string, Record<string, string>>);

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>KEY</Th>
          {locales.map((locale) => (
            <Th key={locale.id}>{locale.label.toUpperCase()}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {Object.entries(translationsByKey).map(([key, values]) => (
          <Tr key={key}>
            <Td>{key}</Td>
            {locales.map((locale) => (
              <Td key={locale.id}>{values[locale.id]}</Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
