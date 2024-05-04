import {
  NavbarContent as SaasNavbarContent,
  SearchInput,
} from "@saas-ui/react";

import { NavbarItem } from "./navbar-item";

export const NavbarContent = () => (
  <SaasNavbarContent justifyContent="flex-end">
    <NavbarItem>
      <SearchInput size="sm" />
    </NavbarItem>
  </SaasNavbarContent>
);
