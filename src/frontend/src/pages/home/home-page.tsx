import { Flex, Text } from "@chakra-ui/react";
import { Page } from "@core/page";
import { useQuery } from "@core/react-query";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@core/tab";

type TranslationMap = {
  [key in string]: string;
};

type TranslationKeys = {
  [key: string]: TranslationMap;
};

type I18nStructure = {
  keys: {
    [group: string]: TranslationKeys;
  };
};

export const HomePage = () => {
  const { data, error, isLoading } = useQuery(
    "/translations",
    "getTranslations"
  );
  if (!data) return <>ERROR</>;
  if (error) return <>{error.message}</>;
  if (isLoading) return <>Loading...</>;

  const { keys } = data as I18nStructure;

  return (
    <Page>
      <Tabs>
        <TabList>
          {Object.keys(keys).map((group, idx) => (
            <Tab key={idx}>{group}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {Object.values(keys).map((key: TranslationKeys, idx) => (
            <TabPanel key={idx}>
              {Object.entries(key).map(([key, value], idx) => (
                <Flex key={idx} gap={3}>
                  <Text>{key.toString()}</Text>
                  <Text>{value.en}</Text>
                  <Text>{value.ko}</Text>
                </Flex>
              ))}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Page>
  );
};
