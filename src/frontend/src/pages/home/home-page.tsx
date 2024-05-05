import { Page } from "@core/page";
import { useQuery } from "@core/react-query";
import { Tab, TabList, Tabs } from "@core/tab";

export const HomePage = () => {
  const { data, error, isLoading } = useQuery(
    "/translations",
    "getTranslations"
  );
  if (!data) return <>ERROR</>;
  if (error) return <>{error.message}</>;
  if (isLoading) return <>Loading...</>;

  const { keys } = data;

  return (
    <Page>
      <Tabs>
        <TabList>
          {Object.keys(keys).map((group, idx) => (
            <Tab key={idx}>{group}</Tab>
          ))}
        </TabList>
      </Tabs>
    </Page>
  );
};
