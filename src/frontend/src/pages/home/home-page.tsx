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
  en: string;
  ko: string;
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
                    header: "key",
                  },
                  {
                    accessorKey: "en",
                    header: "en",
                  },
                  {
                    accessorKey: "ko",
                    header: "ko",
                  },
                ]}
                data={Object.entries(key).map(([key, value]) => ({
                  key,
                  en: value.en,
                  ko: value.ko,
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
