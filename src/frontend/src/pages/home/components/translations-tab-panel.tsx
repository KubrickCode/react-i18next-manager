import { ButtonGroup, Flex } from "@chakra-ui/react";
import { SearchInput } from "@saas-ui/react";
import { useCallback, useState } from "react";
import { IoMdRefresh } from "react-icons/io";

import { Button, IconButton } from "~/core/button";
import { LABELS } from "~/core/constants";
import { useMutation, useQuery } from "~/core/tanstack-react-query";
import { DeleteModal, ModalToggle } from "~/core/modal";
import { Text } from "~/core/text";
import { useToast } from "~/core/toast";

import { TranslationsTable } from "./translations-table";

export type TranslationKeys = {
  [key: string]: {
    [language: string]: string;
  };
};

export type AddTranslationBody = {
  key: string;
  translations: {
    language: string;
    value: string;
  }[];
};

export type EditTranslationBody = {
  newKey: string;
  translations: {
    language: string;
    value: string;
  }[];
};

type TranslationsTabPanelProps = {
  group: string;
  languages: string[];
};

export const TranslationsTabPanel = ({
  group,
  languages,
}: TranslationsTabPanelProps) => {
  const queryKey = `getTranslations-${group}-${languages.join("-")}`;
  const { data, error, isLoading, refetch } = useQuery<{
    translations: TranslationKeys;
  }>(`/translations/${group}`, queryKey);
  const [addMode, setAddMode] = useState(false);
  const [addTranslationBody, setAddTranslationBody] =
    useState<AddTranslationBody>({
      key: "",
      translations: [],
    });
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editTranslationBody, setEditTranslationBody] =
    useState<EditTranslationBody>({
      newKey: "",
      translations: [],
    });

  const toast = useToast();

  const { mutate } = useMutation({
    refetchQueryKeys: [[queryKey]],
  });

  const handleAddTranslationBody = useCallback(
    (addTranslationBody: AddTranslationBody) => {
      setAddTranslationBody({
        ...addTranslationBody,
      });
    },
    []
  );

  const handleEditKey = useCallback((key: string | null) => {
    setEditKey(key);
  }, []);

  const handleEditTranslationBody = useCallback(
    (editTranslationBody: EditTranslationBody) => {
      setEditTranslationBody({
        ...editTranslationBody,
      });
    },
    []
  );

  const handleSaveEdit = useCallback(() => {
    mutate({
      link: `/translations/${group}/${editKey}`,
      method: "put",
      body: {
        newKey: editTranslationBody.newKey,
        translations: editTranslationBody.translations,
      },
    });
    setEditKey(null);
    refetch();
    toast({ description: "Translation resource updated" });
  }, [editTranslationBody, editKey, group, mutate, refetch, toast]);

  const handleSelectedKeys = useCallback((keys: string[]) => {
    setSelectedKeys(keys);
  }, []);

  if (!data) return <>ERROR</>;
  if (error) return <>{error.message}</>;
  if (isLoading) return <>Loading...</>;

  const { translations } = data;

  return (
    <>
      <Flex gap={2}>
        <ButtonGroup alignItems="center" marginBottom={3} size="sm">
          <IconButton
            aria-label="refresh"
            icon={<IoMdRefresh />}
            onClick={() => refetch()}
          />
          {!addMode ? (
            <Button onClick={() => setAddMode(true)}>Add Resource</Button>
          ) : (
            <>
              <Button onClick={() => setAddMode(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  mutate({
                    link: `/translations/${group}`,
                    method: "post",
                    body: addTranslationBody,
                  });
                  setAddMode(false);
                  refetch();
                  toast({ description: "Translation resource added" });
                }}
              >
                {LABELS.SAVE}
              </Button>
            </>
          )}
          {selectedKeys.length > 0 && (
            <ModalToggle
              modal={DeleteModal}
              modalProps={{
                body: (
                  <Text>
                    Are you sure you want to delete these translations?
                  </Text>
                ),
                link: `/translations/${group}/${selectedKeys.join(",")}`,
                onComplete() {
                  setSelectedKeys([]);
                  toast({ description: "Translation resources deleted" });
                },
                refetchQueryKeys: [[queryKey]],
              }}
            >
              <Button>{LABELS.DELETE}</Button>
            </ModalToggle>
          )}
        </ButtonGroup>
        <SearchInput size="sm" width="auto" />
      </Flex>
      <TranslationsTable
        addMode={addMode}
        addTranslationBody={addTranslationBody}
        editKey={editKey}
        editTranslationBody={editTranslationBody}
        languages={languages}
        selectedKeys={selectedKeys}
        translations={translations}
        handleAddTranslationBody={handleAddTranslationBody}
        handleEditKey={handleEditKey}
        handleEditTranslationBody={handleEditTranslationBody}
        handleSaveEdit={handleSaveEdit}
        handleSelectedKeys={handleSelectedKeys}
      />
    </>
  );
};
