import { Sidebar, SidebarSection } from "~/core/sidebar";
import { Button } from "~/core/button";
import { LABELS } from "~/core/constants";
import { Flex } from "~/core/layout";
import { Image } from "~/core/image";
import { useColorModeValue } from "~/core/color-mode";

import { GroupTreeView, SettingMenu } from "./components";

export const HomePageSidebar = () => {
  const darkModeImageSrc = useColorModeValue("logo-light.png", "logo-dark.png");
  return (
    <Sidebar>
      <SidebarSection>
        <Flex alignItems="center" justifyContent="space-between">
          <Button
            leftIcon={
              <Image
                boxSize="2rem"
                objectFit="cover"
                src={darkModeImageSrc}
                alt="logo"
              />
            }
            onClick={() => (location.href = "/")}
            padding={0}
            variant="none"
          >
            {LABELS.APP_TITLE}
          </Button>
          <SettingMenu />
        </Flex>
      </SidebarSection>
      <SidebarSection>
        <GroupTreeView />
      </SidebarSection>
    </Sidebar>
  );
};
