import { Router } from "@core/router";
import { ThemeProvider } from "@core/theme";

export const App = () => (
  <ThemeProvider>
    <Router />
  </ThemeProvider>
);
