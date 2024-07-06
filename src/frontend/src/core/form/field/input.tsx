import { Controller } from "react-hook-form";

import { Input as CoreInput, InputProps as CoreInputProps } from "../../input";
import { FieldError } from "./field-error";

export type InputProps = CoreInputProps & {
  name: string;
  showFieldError?: boolean;
};

export const Input = ({
  name,
  showFieldError = true,
  ...otherProps
}: InputProps) => {
  return (
    <Controller
      name={name}
      render={({
        field: { onBlur, onChange, value },
        fieldState: { invalid },
      }) => {
        return (
          <>
            <CoreInput
              isInvalid={invalid}
              onBlur={onBlur}
              onChange={onChange}
              value={typeof value !== "undefined" ? value : ""}
              {...otherProps}
            />
            {showFieldError && <FieldError name={name} />}
          </>
        );
      }}
    />
  );
};
