import { PropsWithChildren } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { AppShell } from "@saas-ui/react";

import { LayoutNavbar } from "./layout-navbar";

export const Layout = ({ children }: PropsWithChildren) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const fontColor = useColorModeValue("gray.800", "white");

  return (
    <AppShell
      backgroundColor={bgColor}
      color={fontColor}
      height="100vh"
      navbar={<LayoutNavbar />}
      padding="1rem"
    >
      <Box as="main" overflowY="auto">
        {children}
      </Box>
    </AppShell>
  );
};
