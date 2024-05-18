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
  [locale: string]: string | ReactNode;
};

type TranslationsTableProps = {
  addMode: boolean;
  addTranslationBody: AddTranslationBody;
  editKey: string | null;
  editTranslationBody: EditTranslationBody;
  locales: string[];
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
  locales,
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
        ...locales.map((locale) => ({
          accessorKey: locale,
          header: locale.toUpperCase(),
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
                ...locales.reduce(
                  (acc, locale) => ({
                    ...acc,
                    [locale]: (
                      <Input
                        placeholder={`Enter ${locale} translation`}
                        onChange={(e) => {
                          handleAddTranslationBody({
                            ...addTranslationBody,
                            translations: [
                              ...addTranslationBody.translations.filter(
                                (t) => t.locale !== locale
                              ),
                              {
                                locale: locale,
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
                    ...locales.reduce(
                      (acc, locale) => ({
                        ...acc,
                        [locale]: (
                          <Input
                            value={
                              editTranslationBody.translations.find(
                                (t) => t.locale === locale
                              )?.value ?? ""
                            }
                            onChange={(e) => {
                              handleEditTranslationBody({
                                ...editTranslationBody,
                                translations: [
                                  ...editTranslationBody.translations.filter(
                                    (t) => t.locale !== locale
                                  ),
                                  {
                                    locale: locale,
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
                              ([locale, value]) => ({
                                locale,
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
