import { ReactNode } from "react";
import { ButtonGroup } from "@chakra-ui/react";

import { LABELS } from "~/core/constants";
import { DataTable } from "~/core/data-table";
import { Input } from "~/core/input";
import { Button } from "~/core/button";

import {
  AddTranslationBody,
  EditTranslationBody,
  TranslationKeys,
} from "./translations-tab-panel";

type TableData = {
  key: string | ReactNode;
  [language: string]: string | ReactNode;
};

type TranslationsTableProps = {
  addMode: boolean;
  addTranslationBody: AddTranslationBody;
  editKey: string | null;
  editTranslationBody: EditTranslationBody;
  languages: string[];
  selectedKeys: string[];
  translations: TranslationKeys;
  handleAddTranslationBody: (body: AddTranslationBody) => void;
  handleEditKey: (key: string | null) => void;
  handleEditTranslationBody: (body: EditTranslationBody) => void;
  handleSaveEdit: () => void;
  handleSelectedKeys: (keys: string[]) => void;
};

export const TranslationsTable = ({
  addMode,
  addTranslationBody,
  editKey,
  editTranslationBody,
  languages,
  selectedKeys,
  translations,
  handleAddTranslationBody,
  handleEditKey,
  handleEditTranslationBody,
  handleSaveEdit,
  handleSelectedKeys,
}: TranslationsTableProps) => {
  return (
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
        addMode
          ? [
              {
                key: (
                  <Input
                    placeholder="Enter key"
                    onChange={(e) => {
                      handleAddTranslationBody({
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
                          handleAddTranslationBody({
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
              ...Object.entries(translations).map(([key, value]) => ({
                key,
                ...value,
              })),
            ]
          : Object.entries(translations).map(([key, value]) =>
              editKey === key
                ? {
                    key: (
                      <Input
                        value={editTranslationBody.newKey}
                        onChange={(e) => {
                          handleEditTranslationBody({
                            ...editTranslationBody,
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
                              editTranslationBody.translations.find(
                                (t) => t.language === lang
                              )?.value ?? ""
                            }
                            onChange={(e) => {
                              handleEditTranslationBody({
                                ...editTranslationBody,
                                translations: [
                                  ...editTranslationBody.translations.filter(
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
                        <Button onClick={() => handleEditKey(null)}>
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
                          handleEditKey(key);
                          handleEditTranslationBody({
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
          (index) => Object.keys(translations)[Number(index)]
        );
        if (JSON.stringify(newSelectedKeys) !== JSON.stringify(selectedKeys)) {
          handleSelectedKeys(newSelectedKeys);
        }
      }}
    />
  );
};