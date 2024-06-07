import { ReactQueryProvider } from "~/core/react-query";
import { Router } from "~/core/router";
import { ThemeProvider } from "~/core/theme";
import { ModalProvider } from "../modal";
import { AppContextProvider } from "./context";

export const App = () => (
  <ReactQueryProvider>
    <AppContextProvider>
      <ThemeProvider>
        <ModalProvider>
          <Router />
        </ModalProvider>
      </ThemeProvider>
    </AppContextProvider>
  </ReactQueryProvider>
);
