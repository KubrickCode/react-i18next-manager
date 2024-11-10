import { HTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { Box } from "@chakra-ui/react";

import { Text } from "../text";

export type FormFooterProps = HTMLAttributes<HTMLDivElement>;

export const FormFooter = ({ children, ...otherProps }: FormFooterProps) => {
  const {
    formState: { errors },
  } = useFormContext();

  const formError = errors[""];

  return (
    <Box paddingTop={4} {...otherProps}>
      {children}
      {formError && formError.message && (
        <Text color="danger" fontSize="sm" marginTop={1}>
          {formError.message.toString()}
        </Text>
      )}
    </Box>
  );
};
