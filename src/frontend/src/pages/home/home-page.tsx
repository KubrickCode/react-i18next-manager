import { useState } from "react";

import { Page } from "~/core/page";
import { useLayoutContext } from "~/layout/context";

import { TranslationsTable } from "./components/translations-table";
import { TranslationsTableToolbar } from "./components/translations-table-toolbar";

export const HomePage = () => {
  const { selectedGroup } = useLayoutContext();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [term, setTerm] = useState("");

  const handleSelectedIds = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const handleTerm = (term: string) => {
    setTerm(term);
  };

  return (
    <Page>
      {selectedGroup && (
        <>
          <TranslationsTableToolbar
            handleSelectedIds={handleSelectedIds}
            handleTerm={handleTerm}
            selectedIds={selectedIds}
          />
          <TranslationsTable
            handleSelectedIds={handleSelectedIds}
            selectedIds={selectedIds}
            term={term}
          />
        </>
      )}
    </Page>
  );
};
