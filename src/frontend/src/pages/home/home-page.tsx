import { Page } from "@core/page";
import { useQuery } from "@core/tanstack-react-query";
import { Tab, TabList, TabPanels, Tabs } from "@core/tab";
import { TranslationsTabPanel } from "./components/translations-tab-panel";

export const HomePage = () => {
  const {
    data: groups,
    error,
    isLoading,
  } = useQuery<string[]>("/config/groups", "getGroups");

  if (!groups) return <>ERROR</>;
  if (error) return <>{error.message}</>;
  if (isLoading) return <>Loading...</>;

  return (
    <Page>
      <Tabs onChange={(idx) => console.log(idx)} isLazy>
        <TabList>
          {groups.map((group, idx) => (
            <Tab key={idx}>{group}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {groups.map((group, idx) => (
            <TranslationsTabPanel key={idx} group={group} />
          ))}
        </TabPanels>
      </Tabs>
    </Page>
  );
};
