import { Flex } from "@chakra-ui/react";
import { LoadingSpinner, LoadingSpinnerProps } from "@saas-ui/react";

import { VStack } from "../layout";

export const Spinner = (props?: LoadingSpinnerProps) => {
  return <LoadingSpinner {...props} />;
};

export const Block = () => {
  return (
    <VStack justifyContent="center" minHeight="sm">
      <Spinner size="lg" />
    </VStack>
  );
};

export const FullScreen = () => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      position="fixed"
      top="0"
      left="0"
      height="100vh"
      width="100vw"
      zIndex="9999"
    >
      <Spinner size="xl" />
    </Flex>
  );
};
