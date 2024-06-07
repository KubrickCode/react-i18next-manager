import { Sidebar, SidebarSection } from "~/core/sidebar";
import { Button } from "~/core/button";
import { LABELS } from "~/core/constants";
import { Flex } from "~/core/layout";
import { Image } from "~/core/image";
import { useColorModeValue } from "~/core/color-mode";

import { SettingButton } from "./setting-button";
import { HomePageSidebarGroupTreeView } from "./home-page-sidebar-group-treeview";

export const HomePageSidebar = () => {
  const darkModeImageSrc = useColorModeValue("logo-light.png", "logo-dark.png");
  const bgColor = useColorModeValue("white", "gray.800");
  const fontColor = useColorModeValue("gray.800", "white");

  return (
    <Sidebar backgroundColor={bgColor} color={fontColor}>
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
          <SettingButton />
        </Flex>
      </SidebarSection>
      <SidebarSection>
        <HomePageSidebarGroupTreeView />
      </SidebarSection>
    </Sidebar>
  );
};
