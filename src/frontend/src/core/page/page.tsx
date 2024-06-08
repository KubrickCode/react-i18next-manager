import { StackProps, VStack } from "@chakra-ui/react";
import { Suspense } from "react";

import { Loader } from "../loader";

export const Page = ({ children, ...otherProps }: StackProps) => {
  return (
    <VStack align="stretch" width="auto" {...otherProps}>
      <Suspense fallback={<Loader.FullScreen />}>{children}</Suspense>
    </VStack>
  );
};
