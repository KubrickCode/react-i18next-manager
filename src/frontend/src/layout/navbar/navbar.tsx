import { Flex } from "@chakra-ui/react";
import { Navbar as SaasNavbar } from "@saas-ui/react";

import { LABELS } from "~/core/constants";

import { NavbarBrand } from "./navbar-brand";
import { NavbarContent } from "./navbar-content";

export const Navbar = () => (
  <SaasNavbar position="sticky" top="0" zIndex="9999">
    <Flex alignItems="center" justifyContent="space-between">
      <NavbarBrand label={LABELS.NAVBAR} />
      <NavbarContent />
    </Flex>
  </SaasNavbar>
);
