import { Link } from "react-router-dom";

import { Button, Flex, Image } from "@chakra-ui/react";
import { NavbarBrand as SaasNavbarBrand } from "@saas-ui/react";

export const NavbarBrand = ({ label }: { label: string }) => (
  <SaasNavbarBrand>
    <Flex alignItems="center">
      <Link to="/">
        <Button
          leftIcon={
            <Image
              boxSize="3rem"
              objectFit="cover"
              src="logo-light.png"
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
