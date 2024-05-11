import { Flex, Image, useColorModeValue } from "@chakra-ui/react";

import { LABELS } from "~/core/constants";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "~/core/navbar";
import { Link } from "react-router-dom";
import { Button } from "~/core/button";
import { SettingButton } from "./setting";

export const LayoutNavbar = () => {
  const darkModeImageSrc = useColorModeValue("logo-light.png", "logo-dark.png");

  return (
    <Navbar position="sticky" top="0" zIndex="9999">
      <Flex alignItems="center" justifyContent="space-between">
        <NavbarBrand>
          <Flex alignItems="center">
            <Link to="/">
              <Button
                leftIcon={
                  <Image
                    boxSize="3rem"
                    objectFit="cover"
                    src={darkModeImageSrc}
                    alt="logo"
                  />
                }
                variant="none"
              >
                {LABELS.NAVBAR}
              </Button>
            </Link>
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
