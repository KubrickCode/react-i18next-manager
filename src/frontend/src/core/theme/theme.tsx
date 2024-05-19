import { PropsWithChildren } from "react";
import {
  ChakraProvider,
  extendTheme,
  type ThemeConfig as ChakraThemeConfig,
} from "@chakra-ui/react";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import {
  ModalsProvider,
  SaasProvider,
  theme as baseTheme,
} from "@saas-ui/react";

import { colors } from "./colors";

const theme = {
  colors,
};

const saasTheme = extendTheme({ colors }, baseTheme);

export const chakraThemeConfig: ChakraThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const chakraTheme = extendTheme({
  config: chakraThemeConfig,
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
        focusBorderColor: "darkgray.500",
      },
    },
  },
});

export const ThemeProvider = ({ children }: PropsWithChildren) => (
  <SaasProvider theme={saasTheme}>
    <ModalsProvider>
      <EmotionThemeProvider theme={theme}>
        <ChakraProvider theme={chakraTheme}>{children}</ChakraProvider>
      </EmotionThemeProvider>
    </ModalsProvider>
  </SaasProvider>
);
