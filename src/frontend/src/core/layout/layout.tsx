import { PropsWithChildren } from "react";
import { Box } from "@chakra-ui/react";
import { AppShell } from "@saas-ui/react";

import { Navbar } from "./navbar";

export const Layout = ({ children }: PropsWithChildren) => (
  <AppShell navbar={<Navbar />} padding="1rem">
    <Box as="main" overflowY="auto">
      {children}
    </Box>
  </AppShell>
);
