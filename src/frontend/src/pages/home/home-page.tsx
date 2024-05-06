import { ButtonGroup, IconButton, Input } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { IoMdRefresh } from "react-icons/io";

import { Button } from "@core/button";
import { DataTable } from "@core/data-table";
import { Page } from "@core/page";
import { useMutation, useQuery } from "@core/tanstack-react-query";
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
  key: string | ReactNode;
  [language: string]: string | ReactNode;
};

export const HomePage = () => {
  const { data, error, isLoading, refetch } = useQuery(
    "/translations",
    "getTranslations"
  );
  const { mutate } = useMutation({
    link: "/translations",
    method: "post",
    body: {
      translation: "new translation",
    },
  });

  const [isAddingMode, setIsAddingMode] = useState(false);

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
              <ButtonGroup size="sm">
                <IconButton
                  aria-label="refresh"
                  icon={<IoMdRefresh />}
                  marginBottom={3}
                  onClick={() => refetch()}
                />
                {!isAddingMode ? (
                  <Button onClick={() => setIsAddingMode(true)}>
                    Add Resource
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => setIsAddingMode(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        mutate();
                        setIsAddingMode(false);
                      }}
                    >
                      Save
                    </Button>
                  </>
                )}
              </ButtonGroup>
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
                data={
                  isAddingMode
                    ? [
                        {
                          key: <Input placeholder="Enter key" />,
                          ...languages.reduce(
                            (acc, lang) => ({
                              ...acc,
                              [lang]: (
                                <Input
                                  placeholder={`Enter ${lang} translation`}
                                />
                              ),
                            }),
                            {}
                          ),
                        },
                        ...Object.entries(key).map(([key, value]) => ({
                          key,
                          ...value,
                        })),
                      ]
                    : Object.entries(key).map(([key, value]) => ({
                        key,
                        ...value,
                      }))
                }
                isSelectable
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Page>
  );
};
