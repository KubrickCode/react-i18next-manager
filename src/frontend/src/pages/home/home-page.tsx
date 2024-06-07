import { useState } from "react";

import { Page } from "~/core/page";

import { HomePageEmptySection } from "./table/empty-section";
import { useApp } from "~/core/app";
import { HomePageContextProvider } from "./context";
import { AppShell } from "~/core/app-shell";
import { HomePageSidebar } from "./sidebar";
import { TranslationsTable, TranslationsTableToolbar } from "./table";
import { Box } from "~/core/layout";

export const HomePage = () => {
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
    <Page>
      <HomePageContextProvider>
        <AppShell sidebar={<HomePageSidebar />}>
          {locales.length > 0 ? (
            <Box as="main" height="100vh" overflowY="auto" padding="1rem">
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
            </Box>
          ) : (
            <HomePageEmptySection />
          )}
        </AppShell>
      </HomePageContextProvider>
    </Page>
  );
};
