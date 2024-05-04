import { Link } from "react-router-dom";
import { Flex, Image, useColorModeValue } from "@chakra-ui/react";
import { NavbarBrand as SaasNavbarBrand } from "@saas-ui/react";

import { Button } from "@core/button";

export const NavbarBrand = ({ label }: { label: string }) => {
  const darkModeImageSrc = useColorModeValue("logo-light.png", "logo-dark.png");

  return (
    <SaasNavbarBrand>
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
            {label}
          </Button>
        </Link>
      </Flex>
    </SaasNavbarBrand>
  );
};
