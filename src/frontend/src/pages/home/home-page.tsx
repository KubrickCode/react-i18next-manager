import { useState } from "react";

import { Page } from "~/core/page";
import { useLayoutContext } from "~/layout/context";

import { TranslationsTable } from "./components/translations-table";
import { TranslationsTableToolbar } from "./components/translations-table-toolbar";
import { HomePageEmptySection } from "./components/empty-section";

export const HomePage = () => {
  const { locales, selectedGroup } = useLayoutContext();
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
      {selectedGroup && locales.length > 0 ? (
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
      ) : (
        <HomePageEmptySection />
      )}
    </Page>
  );
};
