import {
  NavbarContent as SaasNavbarContent,
  NavbarItem,
  SearchInput,
} from "@saas-ui/react";

export const NavbarContent = () => (
  <SaasNavbarContent justifyContent="flex-end">
    <NavbarItem listStyleType="none">
      <SearchInput size="sm" />
    </NavbarItem>
  </SaasNavbarContent>
);
