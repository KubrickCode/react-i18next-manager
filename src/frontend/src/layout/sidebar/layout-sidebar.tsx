import { Flex, Image, useColorModeValue } from "@chakra-ui/react";

import { Sidebar, SidebarSection } from "~/core/sidebar";
import { Button } from "~/core/button";
import { LABELS } from "~/core/constants";

import { SettingButton } from "./setting-button";
import { LayoutSidebarGroupTreeView } from "./layout-sidebar-group-treeview";

export const LayoutSidebar = () => {
  const darkModeImageSrc = useColorModeValue("logo-light.png", "logo-dark.png");

  return (
    <Sidebar width="20rem">
      <SidebarSection>
        <Flex alignItems="center" justifyContent="space-between">
          <Button
            leftIcon={
              <Image
                boxSize="3rem"
                objectFit="cover"
                src={darkModeImageSrc}
                alt="logo"
              />
            }
            onClick={() => (location.href = "/")}
            variant="none"
          >
            {LABELS.APP_TITLE}
          </Button>
          <SettingButton />
        </Flex>
      </SidebarSection>
      <SidebarSection>
        <LayoutSidebarGroupTreeView />
      </SidebarSection>
    </Sidebar>
  );
};
