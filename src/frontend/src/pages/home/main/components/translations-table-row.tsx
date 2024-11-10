import { useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import { Flex, Td, Tr, useColorModeValue } from "@chakra-ui/react";

import { useApp } from "~/core/app";
import { Button, IconButton } from "~/core/button";
import { Checkbox } from "~/core/checkbox";
import { Highlight } from "~/core/highlight";
import { Input } from "~/core/input";
import { buildApiPath, useMutation } from "~/core/react-query";
import { replaceBlank } from "~/core/utils";
import { i18nKeys, useTranslation } from "~/core/i18n";
import { z } from "~/core/form";

import { useHomePageContext } from "../../context";
import { SchemaDto } from "~/core/codegen";

const schema = z.object({
  newKey: z.string(),
  newValues: z.array(
    z.object({
      localeId: z.string().uuid(),
      value: z.string(),
    })
  ),
});

type TranslationsTableRowProps = {
  isSelected: boolean;
  onSelect: () => void;
  term: string;
  translation: SchemaDto<"GetTranslationsResDto">["translations"][number];
};

export const TranslationsTableRow = ({
  isSelected,
  onSelect,
  term,
  translation,
}: TranslationsTableRowProps) => {
  const { t } = useTranslation();
  const { locales } = useApp();
  const { selectedGroup } = useHomePageContext();
  const [editMode, setEditMode] = useState(false);
  const [translationForm, setTranslationForm] = useState({
    key: translation.key,
    values: translation.values,
  });

  const hoveredBackground = useColorModeValue("gray.50", "gray.900");
  const hoveredIconButtonBackground = useColorModeValue("gray.200", "gray.700");

  const { mutate: editTranslation } = useMutation<
    SchemaDto<"EditTranslationReqBodyDto">
  >({
    refetchQueryKeys: [
      [
        buildApiPath({
          path: "/api/translations/{groupId}",
          params: { groupId: selectedGroup?.id ?? "" },
        }),
      ],
    ],
    schema,
    toast: t(i18nKeys.translation.editTranslationSuccess),
  });

  const handleEditTranslation = () => {
    editTranslation({
      endpoint: {
        path: "/api/translations/{id}",
        params: { id: translation.id },
      },
      method: "patch",
      body: {
        newKey: translationForm.key,
        newValues: translationForm.values,
      },
    });
    setEditMode(false);
  };

  return (
    <Tr _hover={{ bg: hoveredBackground }} key={translation.id}>
      <Td>
        <Checkbox isChecked={isSelected} onChange={onSelect} />
      </Td>
      <Td>
        {editMode ? (
          <Input
            size="sm"
            value={translationForm.key}
            onChange={(e) =>
              setTranslationForm((prev) => ({
                ...prev,
                key: replaceBlank(e.target.value),
              }))
            }
          />
        ) : (
          <Highlight query={term}>{translation.key}</Highlight>
        )}
      </Td>
      {locales.map((locale) => {
        const valueObj = translation.values.find(
          (val) => val.localeId === locale.id
        );
        return (
          <Td key={locale.id}>
            {editMode ? (
              <Input
                size="sm"
                value={
                  translationForm.values.find(
                    (val) => val.localeId === locale.id
                  )?.value
                }
                onChange={(e) => {
                  const newValues = translationForm.values.map((val) => {
                    if (val.localeId === locale.id) {
                      return {
                        ...val,
                        value: e.target.value,
                      };
                    }
                    return val;
                  });
                  setTranslationForm((prev) => ({
                    ...prev,
                    values: newValues,
                  }));
                }}
              />
            ) : (
              <Highlight query={term}>{valueObj?.value ?? ""}</Highlight>
            )}
          </Td>
        );
      })}
      <Td>
        <Flex gap={2}>
          <IconButton
            _hover={{ bg: hoveredIconButtonBackground }}
            aria-label="edit"
            colorScheme="gray"
            icon={editMode ? <FaSave /> : <FaEdit />}
            onClick={() => {
              editMode ? handleEditTranslation() : setEditMode(true);
            }}
            size="sm"
            variant="outline"
          />
          <Button
            _hover={{ bg: hoveredIconButtonBackground }}
            colorScheme="gray"
            onClick={() => setEditMode(false)}
            size="sm"
            variant="outline"
            visibility={editMode ? "visible" : "hidden"}
          >
            X
          </Button>
        </Flex>
      </Td>
    </Tr>
  );
};
