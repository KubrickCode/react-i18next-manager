import { ReactQueryProvider } from "~/core/tanstack-react-query";
import { Router } from "~/core/router";
import { ThemeProvider } from "~/core/theme";

export const App = () => (
  <ReactQueryProvider>
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  </ReactQueryProvider>
);
