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
        {translations.map((translation) => (
          <Tr key={translation.id}>
            <Td>{translation.key}</Td>
            {locales.map((locale) => {
              const valueObj = translation.values.find(
                (val) => val.localeId === locale.id
              );
              return <Td key={locale.id}>{valueObj ? valueObj.value : ""}</Td>;
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
