import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { SaasProvider, theme as baseTheme } from "@saas-ui/react";
import { PropsWithChildren } from "react";

import { colors } from "./colors";

const theme = {
  colors,
};

const saasTheme = extendTheme({ colors }, baseTheme);

const chakraTheme = extendTheme({
  colors,
  styles: {
    global: {
      body: {
        backgroundColor: "white",
        fontSize: "md",
        color: "gray.800",
      },
    },
  },
  components: {
    Input: {
      defaultProps: {
        focusBorderColor: "primary.500",
      },
    },
  },
});

export const ThemeProvider = ({ children }: PropsWithChildren) => (
  <SaasProvider theme={saasTheme}>
    <EmotionThemeProvider theme={theme}>
      <ChakraProvider theme={chakraTheme}>{children}</ChakraProvider>
    </EmotionThemeProvider>
  </SaasProvider>
);
