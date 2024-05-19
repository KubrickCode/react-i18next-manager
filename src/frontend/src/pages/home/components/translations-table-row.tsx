import { useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";

import { Button, IconButton } from "~/core/button";
import { GetTranslationsResDto } from "~/core/codegen";
import { useColorModeValue } from "~/core/color-mode";
import { Input } from "~/core/input";
import { Flex } from "~/core/layout";
import { Td, Tr } from "~/core/table";
import { Text } from "~/core/text";
import { useLayoutContext } from "~/layout/context";

type TranslationsTableRowProps = {
  translation: GetTranslationsResDto["translations"][number];
};

export const TranslationsTableRow = ({
  translation,
}: TranslationsTableRowProps) => {
  const { locales } = useLayoutContext();
  const [editMode, setEditMode] = useState(false);
  const [translationForm, setTranslationForm] = useState({
    key: translation.key,
    values: translation.values,
  });

  const hoveredBackground = useColorModeValue("gray.50", "gray.900");

  return (
    <Tr _hover={{ bg: hoveredBackground }} key={translation.id}>
      <Td>
        {editMode ? (
          <Input
            size="sm"
            value={translationForm.key}
            onChange={(e) =>
              setTranslationForm((prev) => ({
                ...prev,
                key: e.target.value,
              }))
            }
          />
        ) : (
          <Text fontSize="sm">{translation.key}</Text>
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
              <Text fontSize="sm">{valueObj?.value}</Text>
            )}
          </Td>
        );
      })}
      <Td>
        <Flex gap={2}>
          <IconButton
            _hover={{ bg: "gray.200" }}
            aria-label="edit"
            colorScheme="gray"
            icon={editMode ? <FaSave /> : <FaEdit />}
            onClick={() => setEditMode((prev) => !prev)}
            size="sm"
            variant="outline"
          />
          <Button
            _hover={{ bg: "gray.200" }}
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
