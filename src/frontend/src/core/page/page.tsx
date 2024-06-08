import { StackProps, VStack } from "@chakra-ui/react";

export const Page = ({ ...otherProps }: StackProps) => {
  return <VStack align="stretch" width="auto" {...otherProps} />;
};
