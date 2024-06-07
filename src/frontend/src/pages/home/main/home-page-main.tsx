import { useApp } from "~/core/app";
import { Box } from "~/core/layout";

import { TranslationsTableToolbar } from "./components/translations-table-toolbar";
import { TranslationsTable } from "./components/translations-table";
import { EmptySection } from "./components/empty-section";
import { useState } from "react";

export const HomePageMain = () => {
  const { locales } = useApp();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [term, setTerm] = useState("");

  const handleSelectedIds = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const handleTerm = (term: string) => {
    setTerm(term);
  };

  return (
    <Box as="main" height="100vh" overflowY="auto" padding="1rem">
      {locales.length > 0 ? (
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
        <EmptySection />
      )}
    </Box>
  );
};
