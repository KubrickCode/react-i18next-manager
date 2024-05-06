import { NavbarContent as SaasNavbarContent } from "@saas-ui/react";

import { NavbarItem } from "./navbar-item";
import { SettingButton } from "./setting";

export const NavbarContent = () => (
  <SaasNavbarContent
    alignItems="center"
    display="flex"
    gap={2}
    justifyContent="flex-end"
  >
    <NavbarItem>
      <SettingButton />
    </NavbarItem>
  </SaasNavbarContent>
);
