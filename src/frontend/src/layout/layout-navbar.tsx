import { Flex, Image, useColorModeValue } from "@chakra-ui/react";

import { LABELS } from "~/core/constants";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "~/core/navbar";
import { Button } from "~/core/button";
import { SettingButton } from "./setting";

export const LayoutNavbar = () => {
  const darkModeImageSrc = useColorModeValue("logo-light.png", "logo-dark.png");

  return (
    <Navbar position="sticky" top="0" zIndex="9999">
      <Flex alignItems="center" justifyContent="space-between">
        <NavbarBrand>
          <Flex alignItems="center">
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
              {LABELS.NAVBAR}
            </Button>
          </Flex>
        </NavbarBrand>
        <NavbarContent
          alignItems="center"
          display="flex"
          gap={2}
          justifyContent="flex-end"
        >
          <NavbarItem listStyleType="none">
            <SettingButton />
          </NavbarItem>
        </NavbarContent>
      </Flex>
    </Navbar>
  );
};
