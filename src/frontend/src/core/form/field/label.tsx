import { PropsWithChildren, useContext } from "react";
import { FormLabel, FormLabelProps } from "@chakra-ui/react";

import { i18nKeys, useTranslation } from "~/core/i18n";
import { Text } from "~/core/text";

import { FieldContext } from "./field";

export const Optional = () => {
  const { t } = useTranslation();
  return (
    <Text color="gray.500" fontStyle="italic" fontWeight="normal">
      &nbsp;-&nbsp;{t(i18nKeys.form.optional)}
    </Text>
  );
};

export const Required = () => (
  <Text color="red.700" fontStyle="italic" fontWeight="normal">
    *
  </Text>
);

export type LabelProps = FormLabelProps & PropsWithChildren;

export const Label = ({ children, ...otherProps }: LabelProps) => {
  const { optional, readonly } = useContext(FieldContext);
  return (
    <FormLabel
      alignItems="center"
      display="flex"
      fontSize="xs"
      fontWeight="semibold"
      height={6}
      margin={0}
      {...otherProps}
    >
      {children}
      {!readonly && (optional ? <Optional /> : <Required />)}
    </FormLabel>
  );
};
