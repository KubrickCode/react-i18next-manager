import { ButtonGroup, Flex, IconButton, Input } from "@chakra-ui/react";
import { Button } from "@core/button";
import { DataTable } from "@core/data-table";
import { TabPanel } from "@core/tab";
import { useMutation, useQuery } from "@core/tanstack-react-query";
import { SearchInput } from "@saas-ui/react";
import { ReactNode, useState } from "react";
import { IoMdRefresh } from "react-icons/io";

type TranslationMap = {
  [language: string]: string;
};

type TranslationKeys = {
  [key: string]: TranslationMap;
};

type I18nStructure = {
  keys: TranslationKeys;
};

type TableData = {
  key: string | ReactNode;
  [language: string]: string | ReactNode;
};

type TranslationsTabPanelProps = {
  group: string;
};

type AddTranslationBody = {
  group: string;
  data: {
    key: string;
    translations: {
      language: string;
      value: string;
    }[];
  };
};

export const TranslationsTabPanel = ({ group }: TranslationsTabPanelProps) => {
  const getLanguagesResult = useQuery<string[]>(
    "/config/languages",
    "getLanguages"
  );
  const getTranslationsResult = useQuery<I18nStructure>(
    `/translations/${group}`,
    `getTranslations-${group}`
  );
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [addTranslationBody, setAddTranslationBody] =
    useState<AddTranslationBody>({
      group,
      data: {
        key: "",
        translations: [],
      },
    });
  const { mutate } = useMutation();

  if (!getLanguagesResult.data || !getTranslationsResult.data)
    return <>ERROR</>;
  if (getLanguagesResult.error || getTranslationsResult.error)
    return (
      <>
        {getLanguagesResult.error?.message ??
          getTranslationsResult.error?.message}
      </>
    );
  if (getLanguagesResult.isLoading || getTranslationsResult.isLoading)
    return <>Loading...</>;

  const languages = getLanguagesResult.data;
  const translations = getTranslationsResult.data;

  return (
    <TabPanel>
      <Flex gap={2}>
        <ButtonGroup size="sm">
          <IconButton
            aria-label="refresh"
            icon={<IoMdRefresh />}
            marginBottom={3}
            onClick={() => getTranslationsResult.refetch()}
          />
          {!isAddingMode ? (
            <Button onClick={() => setIsAddingMode(true)}>Add Resource</Button>
          ) : (
            <>
              <Button onClick={() => setIsAddingMode(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  mutate({
                    link: "/translations",
                    method: "post",
                    body: addTranslationBody,
                  });
                  setIsAddingMode(false);
                  getTranslationsResult.refetch();
                }}
              >
                Save
              </Button>
            </>
          )}
        </ButtonGroup>
        <SearchInput size="sm" width="auto" />
      </Flex>
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
                  key: (
                    <Input
                      placeholder="Enter key"
                      onChange={(e) => {
                        setAddTranslationBody({
                          ...addTranslationBody,
                          data: {
                            ...addTranslationBody.data,
                            key: e.target.value,
                          },
                        });
                      }}
                    />
                  ),
                  ...languages.reduce(
                    (acc, lang) => ({
                      ...acc,
                      [lang]: (
                        <Input
                          placeholder={`Enter ${lang} translation`}
                          onChange={(e) => {
                            setAddTranslationBody({
                              ...addTranslationBody,
                              data: {
                                ...addTranslationBody.data,
                                translations: [
                                  ...addTranslationBody.data.translations,
                                  {
                                    language: lang,
                                    value: e.target.value,
                                  },
                                ],
                              },
                            });
                          }}
                        />
                      ),
                    }),
                    {}
                  ),
                },
                ...Object.entries(translations.keys).map(([key, value]) => ({
                  key,
                  ...value,
                })),
              ]
            : Object.entries(translations.keys).map(([key, value]) => ({
                key,
                ...value,
              }))
        }
        enableMultiSort={false}
        isSelectable
        isSortable
      />
    </TabPanel>
  );
};
