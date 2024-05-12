import { PropsWithChildren } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { AppShell } from "@saas-ui/react";

import { LayoutContextProvider } from "./context";
import { LayoutSidebar } from "./layout-sidebar";

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
