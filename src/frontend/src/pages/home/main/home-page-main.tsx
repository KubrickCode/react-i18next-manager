import { Suspense, useEffect, useState } from "react";

import { Loader } from "~/core/loader";

import { TranslationsTableToolbar, TranslationsTable } from "./components";
import { useHomePageContext } from "../context";
import { Box } from "@chakra-ui/react";

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

  // TODO: 현재 그룹이 바뀌어도 선택된 아이디와 검색어가 초기화되지 않음. useEffect 사용하지 않도록 구조 변경 필요.
  useEffect(() => {
    setSelectedIds([]);
    setTerm("");
  }, [selectedGroup?.id]);

  return (
    <Box as="main" height="100vh" overflowY="auto" padding="1rem">
      {selectedGroup && (
        <>
          <TranslationsTableToolbar
            handleSelectedIds={handleSelectedIds}
            handleTerm={handleTerm}
            selectedIds={selectedIds}
          />
          <Suspense fallback={<Loader.Block />}>
            <TranslationsTable
              handleSelectedIds={handleSelectedIds}
              selectedIds={selectedIds}
              term={term}
            />
          </Suspense>
        </>
      )}
    </Box>
  );
};
