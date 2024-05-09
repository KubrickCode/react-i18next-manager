import { Page } from "~/core/page";
import { useQuery } from "~/core/tanstack-react-query";
import { Tab, TabList, TabPanels, Tabs } from "~/core/tab";

import { TranslationsTabPanel } from "./components/translations-tab-panel";

export const HomePage = () => {
  const getGroupsQueryResult = useQuery<string[]>(
    "/config/groups",
    "getGroups"
  );
  const getLanguagesQueryResult = useQuery<string[]>(
    "/config/languages",
    "getLanguages"
  );

  if (!getLanguagesQueryResult.data || !getGroupsQueryResult.data)
    return <>ERROR</>;
  if (getLanguagesQueryResult.error || getGroupsQueryResult.error)
    return (
      <>
        {getLanguagesQueryResult.error?.message ??
          getGroupsQueryResult.error?.message}
      </>
    );
  if (getLanguagesQueryResult.isLoading || getGroupsQueryResult.isLoading)
    return <>Loading...</>;

  const languages = getLanguagesQueryResult.data;
  const groups = getGroupsQueryResult.data;

  return (
    <Page>
      <Tabs isLazy>
        <TabList>
          {groups.map((group, idx) => (
            <Tab key={idx}>{group}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {groups.map((group, idx) => (
            <TranslationsTabPanel
              key={idx}
              group={group}
              languages={languages}
            />
          ))}
        </TabPanels>
      </Tabs>
    </Page>
  );
};
