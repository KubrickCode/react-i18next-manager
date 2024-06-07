import { Page } from "~/core/page";
import { AppShell } from "~/core/app-shell";

import { HomePageContextProvider } from "./context";
import { HomePageSidebar } from "./sidebar";
import { HomePageMain } from "./main";

export const HomePage = () => (
  <Page>
    <HomePageContextProvider>
      <AppShell children={<HomePageMain />} sidebar={<HomePageSidebar />} />
    </HomePageContextProvider>
  </Page>
);
