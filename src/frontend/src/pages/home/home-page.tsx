import { Page } from "~/core/page";
import { useQuery } from "~/core/react-query";
import { useLayoutContext } from "~/layout/context";
import { GetLocalesResDto } from "~/core/codegen";

import { TranslationsTable } from "./components/translations-table";
import { TranslationsTableToolbar } from "./components/translations-table-toolbar";

export const HomePage = () => {
  const { data, error, isLoading } = useQuery<GetLocalesResDto>(
    "/locales",
    "getLocales"
  );
  const { selectedGroup } = useLayoutContext();

  if (!data) return <>ERROR</>;
  if (error) return <>{error?.message}</>;
  if (isLoading) return <>Loading...</>;

  return (
    <Page>
      {selectedGroup && (
        <>
          <TranslationsTableToolbar />
          <TranslationsTable
            locales={data.locales.map(({ id, label }) => ({ id, label }))}
            selectedGroupId={selectedGroup.id}
          />
        </>
      )}
    </Page>
  );
};
