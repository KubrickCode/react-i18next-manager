import _ from "lodash";
import { useFormContext } from "react-hook-form";
import { Trans } from "react-i18next";

import { Text } from "~/core/text";

export const FieldError = ({ name }: { name: string }) => {
  const context = useFormContext();

  const error = _.get(context.formState.errors, name);

  if (!error) return null;

  return (
    <Text color="danger" fontSize="sm">
      <Trans>{error.message}</Trans>
    </Text>
  );
};
