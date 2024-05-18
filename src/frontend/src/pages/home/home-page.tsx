import { Page } from "~/core/page";
import { useQuery } from "~/core/tanstack-react-query";

import { TranslationsTabPanel } from "./components/translations-tab-panel";
import { useLayoutContext } from "~/layout/context";
import { GetLocalesResDto } from "~/core/codegen";

export const HomePage = () => {
  const { data, error, isLoading } = useQuery<GetLocalesResDto["locales"]>(
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
        <TranslationsTabPanel
          group={selectedGroup}
          locales={data.map(({ label }) => label)}
        />
      )}
    </Page>
  );
};
