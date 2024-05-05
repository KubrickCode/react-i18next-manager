import { DataTable } from "@core/data-table";
import { Page } from "@core/page";
import { useQuery } from "@core/react-query";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@core/tab";

type TranslationMap = {
  [key in string]: string;
};

type TranslationKeys = {
  [key: string]: TranslationMap;
};

type I18nStructure = {
  keys: {
    [group: string]: TranslationKeys;
  };
};

type TableData = {
  key: string;
  [language: string]: string;
};

export const HomePage = () => {
  const { data, error, isLoading } = useQuery(
    "/translations",
    "getTranslations"
  );
  if (!data) return <>ERROR</>;
  if (error) return <>{error.message}</>;
  if (isLoading) return <>Loading...</>;

  const { keys } = data as I18nStructure;

  const languages = Object.keys(Object.values(Object.values(keys)[0])[0]);

  return (
    <Page>
      <Tabs>
        <TabList>
          {Object.keys(keys).map((group, idx) => (
            <Tab key={idx}>{group}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {Object.values(keys).map((key: TranslationKeys, idx) => (
            <TabPanel key={idx}>
              <DataTable<TableData>
                columns={[
                  {
                    accessorKey: "key",
                    header: "KEY",
                  },
                  ...languages.map((lang) => ({
                    accessorKey: lang,
                    header: lang.toUpperCase(),
                  })),
                ]}
                data={Object.entries(key).map(([key, value]) => ({
                  key,
                  ...value,
                }))}
                isSelectable
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Page>
  );
};
