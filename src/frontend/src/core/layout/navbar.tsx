import { Flex } from "@chakra-ui/react";
import { Navbar as SaasNavbar } from "@saas-ui/react";

import { NavbarBrand } from "./navbar-brand";
import { NavbarContent } from "./navbar-content";

const NAVBAR_LABEL = "I18n Studio";

export const Navbar = () => (
  <SaasNavbar position="sticky" top="0">
    <Flex alignItems="center" justifyContent="space-between">
      <NavbarBrand label={NAVBAR_LABEL} />
      <NavbarContent />
    </Flex>
  </SaasNavbar>
);
