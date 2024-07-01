import { useFormContext } from "react-hook-form";

import { Button, ButtonProps } from "../button";
import { i18nKeys, useTranslation } from "../i18n";

export type SubmitButtonProps = ButtonProps;

export const SubmitButton = ({
  children,
  ...otherProps
}: SubmitButtonProps) => {
  const { t } = useTranslation();
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button
      isDisabled={isSubmitting}
      isLoading={isSubmitting}
      type="submit"
      width="full"
      {...otherProps}
    >
      {children || t(i18nKeys.common.save)}
    </Button>
  );
};
