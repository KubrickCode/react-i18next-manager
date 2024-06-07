import { ReactQueryProvider } from "~/core/react-query";
import { Router } from "~/core/router";
import { ThemeProvider } from "~/core/theme";

import { ModalProvider } from "../modal";
import { AppContextProvider } from "./context";
import { Layout } from "../layout";

export const App = () => (
  <ReactQueryProvider>
    <AppContextProvider>
      <ThemeProvider>
        <ModalProvider>
          <Layout>
            <Router />
          </Layout>
        </ModalProvider>
      </ThemeProvider>
    </AppContextProvider>
  </ReactQueryProvider>
);
