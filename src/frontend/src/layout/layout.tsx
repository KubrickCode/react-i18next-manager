import { PropsWithChildren } from "react";

import { Box } from "~/core/layout";
import { useColorModeValue } from "~/core/color-mode";
import { AppShell } from "~/core/app-shell";

import { LayoutContextProvider } from "./context";
import { LayoutSidebar } from "./sidebar";

export const Layout = ({ children }: PropsWithChildren) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const fontColor = useColorModeValue("gray.800", "white");

  return (
    <LayoutContextProvider>
      <AppShell
        backgroundColor={bgColor}
        color={fontColor}
        height="100vh"
        padding="1rem"
        sidebar={<LayoutSidebar />}
      >
        <Box as="main" overflowY="auto">
          {children}
        </Box>
      </AppShell>
    </LayoutContextProvider>
  );
};
