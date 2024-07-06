import { Flex, FlexProps } from "../../layout";

export type FieldsProps = FlexProps;

export const Fields = ({ ...props }: FieldsProps) => (
  <Flex direction="column" gap={4} {...props} />
);
