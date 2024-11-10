import { Flex, FlexProps } from "@chakra-ui/react";

export type FieldsProps = FlexProps;

export const Fields = ({ ...props }: FieldsProps) => (
  <Flex direction="column" gap={4} {...props} />
);
