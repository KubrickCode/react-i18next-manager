import { Button } from "~/core/button";
import { LABELS } from "~/core/constants";
import { GroupTreeView } from "~/shared/group";

import { SettingMenu } from "./components";
import { useHomePageContext } from "../context";
import { Flex, Image, useColorModeValue } from "@chakra-ui/react";
import { Sidebar, SidebarSection } from "@saas-ui/react";

export const HomePageSidebar = () => {
  const { groups, handleSelectedGroup } = useHomePageContext();
  const darkModeImageSrc = useColorModeValue("logo-light.png", "logo-dark.png");

  return (
    <Sidebar padding={5}>
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
        <GroupTreeView
          groups={groups}
          handleSelectedGroup={handleSelectedGroup}
          needsMutation
          height={1000}
          width={300}
        />
      </SidebarSection>
    </Sidebar>
  );
};
