import { FieldValues, UseFormReturn } from "react-hook-form";
import { Flex, FlexProps } from "../layout";

export type FormProps<FormValues extends FieldValues = FieldValues> =
  FlexProps & {
    onSubmit: ReturnType<UseFormReturn<FormValues>["handleSubmit"]>;
  };

export const Form = <FormValues extends FieldValues>({
  onSubmit,
  ...otherProps
}: FormProps<FormValues>) => (
  <Flex
    as="form"
    direction="column"
    gap={4}
    onSubmit={onSubmit}
    {...otherProps}
  />
);
