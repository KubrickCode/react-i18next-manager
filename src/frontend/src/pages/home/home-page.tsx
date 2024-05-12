import { Page } from "~/core/page";
import { useQuery } from "~/core/tanstack-react-query";

import { TranslationsTabPanel } from "./components/translations-tab-panel";
import { useLayoutContext } from "~/layout/context";

export const HomePage = () => {
  const getLanguagesQueryResult = useQuery<string[]>(
    "/config/languages",
    "getLanguages"
  );
  const { selectedGroup } = useLayoutContext();

  if (!getLanguagesQueryResult.data) return <>ERROR</>;
  if (getLanguagesQueryResult.error)
    return <>{getLanguagesQueryResult.error?.message}</>;
  if (getLanguagesQueryResult.isLoading) return <>Loading...</>;

  const languages = getLanguagesQueryResult.data;

  return (
    <Page>
      {selectedGroup && (
        <TranslationsTabPanel group={selectedGroup} languages={languages} />
      )}
    </Page>
  );
};
