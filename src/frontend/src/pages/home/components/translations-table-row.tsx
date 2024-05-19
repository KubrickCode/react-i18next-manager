import { IconButton } from "~/core/button";
import { GetTranslationsResDto } from "~/core/codegen";
import { Td, Tr } from "~/core/table";
import { useLayoutContext } from "~/layout/context";

type TranslationsTableRowProps = {
  translation: GetTranslationsResDto["translations"][number];
};

export const TranslationsTableRow = ({
  translation,
}: TranslationsTableRowProps) => {
  const { locales } = useLayoutContext();

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
