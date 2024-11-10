import { Page } from "~/core/page";

import { HomePageContextProvider } from "./context";
import { HomePageSidebar } from "./sidebar";
import { HomePageMain } from "./main";
import { AppShell } from "@saas-ui/react";

export const HomePage = () => (
  <Page>
    <HomePageContextProvider>
      <AppShell sidebar={<HomePageSidebar />}>
        <HomePageMain />
      </AppShell>
    </HomePageContextProvider>
  </Page>
);
