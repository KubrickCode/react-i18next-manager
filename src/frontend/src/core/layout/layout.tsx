import { PropsWithChildren } from "react";

import { Box } from "./box";

export const Layout = ({ children }: PropsWithChildren) => (
  <Box height="100%" width="100%">
    {children}
  </Box>
);
