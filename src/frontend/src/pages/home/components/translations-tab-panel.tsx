import { ButtonGroup, Flex, IconButton, Input } from "@chakra-ui/react";
import { SearchInput } from "@saas-ui/react";
import { ReactNode, useState } from "react";
import { IoMdRefresh } from "react-icons/io";

import { Button } from "~/core/button";
import { LABELS } from "~/core/constants";
import { DataTable } from "~/core/data-table";
import { TabPanel } from "~/core/tab";
import { useMutation, useQuery } from "~/core/tanstack-react-query";

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
  key: string;
  translations: {
    language: string;
    value: string;
  }[];
};

type EditTranslationBody = {
  newKey: string;
  translations: {
    language: string;
    value: string;
  }[];
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
      key: "",
      translations: [],
    });
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [editKey, setEditKey] = useState<string | null>(null);
  const [editData, setEditData] = useState<EditTranslationBody>({
    newKey: "",
    translations: [],
  });

  const { mutate } = useMutation({
    refetchQueryKey: [`getTranslations-${group}`],
  });

  const handleSaveEdit = () => {
    mutate({
      link: `/translations/${group}/${editKey}`,
      method: "put",
      body: {
        newKey: editData.newKey,
        translations: editData.translations,
      },
    });
    setEditKey(null);
    getTranslationsResult.refetch();
  };

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
                    link: `/translations/${group}`,
                    method: "post",
                    body: addTranslationBody,
                  });
                  setIsAddingMode(false);
                  getTranslationsResult.refetch();
                }}
              >
                {LABELS.SAVE}
              </Button>
            </>
          )}
          {selectedKeys.length > 0 && (
            <Button
              onClick={() => {
                mutate({
                  link: `/translations/${group}/${selectedKeys.join(",")}`,
                  method: "delete",
                });
                setSelectedKeys([]);
                getTranslationsResult.refetch();
              }}
            >
              {LABELS.DELETE}
            </Button>
          )}
        </ButtonGroup>
        <SearchInput size="sm" width="auto" />
      </Flex>
      <DataTable<TableData>
        columns={[
          {
            accessorKey: "key",
            header: LABELS.KEY,
          },
          ...languages.map((lang) => ({
            accessorKey: lang,
            header: lang.toUpperCase(),
          })),
          {
            accessorKey: "actions",
            header: LABELS.ACTIONS,
          },
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
                          key: e.target.value,
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
                              translations: [
                                ...addTranslationBody.translations.filter(
                                  (t) => t.language !== lang
                                ),
                                {
                                  language: lang,
                                  value: e.target.value,
                                },
                              ],
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
            : Object.entries(translations.keys).map(([key, value]) =>
                editKey === key
                  ? {
                      key: (
                        <Input
                          value={editData.newKey}
                          onChange={(e) => {
                            setEditData({
                              ...editData,
                              newKey: e.target.value,
                            });
                          }}
                        />
                      ),
                      ...languages.reduce(
                        (acc, lang) => ({
                          ...acc,
                          [lang]: (
                            <Input
                              value={
                                editData.translations.find(
                                  (t) => t.language === lang
                                )?.value ?? ""
                              }
                              onChange={(e) => {
                                setEditData({
                                  ...editData,
                                  translations: [
                                    ...editData.translations.filter(
                                      (t) => t.language !== lang
                                    ),
                                    {
                                      language: lang,
                                      value: e.target.value,
                                    },
                                  ],
                                });
                              }}
                            />
                          ),
                        }),
                        {}
                      ),
                      actions: (
                        <ButtonGroup size="sm">
                          <Button onClick={() => setEditKey(null)}>
                            {LABELS.CANCEL}
                          </Button>
                          <Button onClick={handleSaveEdit}>Save</Button>
                        </ButtonGroup>
                      ),
                    }
                  : {
                      key,
                      ...value,
                      actions: (
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditKey(key);
                            setEditData({
                              newKey: key,
                              translations: Object.entries(value).map(
                                ([language, value]) => ({
                                  language,
                                  value,
                                })
                              ),
                            });
                          }}
                        >
                          {LABELS.EDIT}
                        </Button>
                      ),
                    }
              )
        }
        enableMultiSort={false}
        isSelectable
        isSortable
        onSelectedRowsChange={(selected) => {
          const newSelectedKeys = selected.map(
            (index) => Object.keys(translations.keys)[Number(index)]
          );
          if (
            JSON.stringify(newSelectedKeys) !== JSON.stringify(selectedKeys)
          ) {
            setSelectedKeys(newSelectedKeys);
          }
        }}
      />
    </TabPanel>
  );
};
