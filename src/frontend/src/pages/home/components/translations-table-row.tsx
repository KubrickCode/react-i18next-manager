import { IconButton } from "~/core/button";
import { GetTranslationsResDto } from "~/core/codegen";
import { Td, Tr } from "~/core/table";

type TranslationsTableRowProps = {
  locales: {
    id: string;
    label: string;
  }[];
  translation: GetTranslationsResDto["translations"][number];
};

export const TranslationsTableRow = ({
  locales,
  translation,
}: TranslationsTableRowProps) => {
  return (
    <Tr _hover={{ bg: "gray.50" }} key={translation.id}>
      <Td>{translation.key}</Td>
      {locales.map((locale) => {
        const valueObj = translation.values.find(
          (val) => val.localeId === locale.id
        );
        return <Td key={locale.id}>{valueObj ? valueObj.value : ""}</Td>;
      })}
      <Td>
        <IconButton
          _hover={{ bg: "gray.200" }}
          aria-label="edit"
          size="xs"
          variant="ghost"
        />
      </Td>
    </Tr>
  );
};
