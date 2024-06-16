import { Suspense } from "react";

import { ReactQueryProvider } from "~/core/react-query";
import { Router } from "~/core/router";
import { ThemeProvider } from "~/core/theme";

import { ModalProvider } from "../modal";
import { AppContextProvider } from "./context";
import { Layout } from "../layout";
import { Loader } from "../loader";
import { I18nProvider } from "../i18n";

export const App = () => (
  <ThemeProvider>
    <I18nProvider>
      <Layout>
        <ReactQueryProvider>
          <Suspense fallback={<Loader.FullScreen />}>
            <AppContextProvider>
              <ModalProvider>
                <Router />
              </ModalProvider>
            </AppContextProvider>
          </Suspense>
        </ReactQueryProvider>
      </Layout>
    </I18nProvider>
  </ThemeProvider>
);
