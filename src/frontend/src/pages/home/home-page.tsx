import { Page } from "~/core/page";

import { HomePageContextProvider } from "./context";
import { AppShell } from "~/core/app-shell";
import { HomePageSidebar } from "./sidebar";
import { HomePageMain } from "./main";

export const HomePage = () => (
  <Page>
    <HomePageContextProvider>
      <AppShell children={<HomePageMain />} sidebar={<HomePageSidebar />} />
    </HomePageContextProvider>
  </Page>
);
