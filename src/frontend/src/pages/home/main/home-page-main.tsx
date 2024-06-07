import { useState } from "react";

import { Box } from "~/core/layout";

import {
  TranslationsTableToolbar,
  TranslationsTable,
  EmptyState,
} from "./components";
import { useHomePageContext } from "../context";

export const HomePageMain = () => {
  const { selectedGroup } = useHomePageContext();
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
      {selectedGroup ? (
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
        <EmptyState />
      )}
    </Box>
  );
};
