import { Page } from "~/core/page";
import { useLayoutContext } from "~/layout/context";

import { TranslationsTable } from "./components/translations-table";
import { TranslationsTableToolbar } from "./components/translations-table-toolbar";

export const HomePage = () => {
  const { locales, selectedGroup } = useLayoutContext();

  return (
    <Page>
      {selectedGroup && (
        <>
          <TranslationsTableToolbar />
          <TranslationsTable
            locales={locales.map(({ id, label }) => ({ id, label }))}
            selectedGroupId={selectedGroup.id}
          />
        </>
      )}
    </Page>
  );
};
