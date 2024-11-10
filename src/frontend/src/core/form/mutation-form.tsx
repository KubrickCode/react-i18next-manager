import { createElement, ReactNode } from "react";
import {
  Control,
  FieldValues,
  FormProvider,
  FormState,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import { Form, FormProps } from "./form";
import { useMutationForm, UseMutationFormProps } from "./use-mutation-form";

export type MutationFormProps<
  FormValues extends FieldValues = FieldValues,
  MutationResult = {}
> = Omit<FormProps, "children" | "onSubmit"> &
  UseMutationFormProps<FormValues, MutationResult> & {
    children:
      | ReactNode
      | ((form: {
          control: Control<FormValues>;
          formState: FormState<FormValues>;
          register: UseFormRegister<FormValues>;
          setError: UseFormSetError<FormValues>;
          setValue: UseFormSetValue<FormValues>;
          submit: (e?: React.BaseSyntheticEvent) => Promise<void>;
          watch: UseFormWatch<FormValues>;
        }) => JSX.Element);
  };

export const MutationForm = <
  FormValues extends FieldValues = FieldValues,
  MutationResult = {}
>({
  body,
  children,
  config,
  endpoint,
  defaultValues,
  method,
  onComplete,
  refetchQueryKeys,
  schema,
  toast,
}: MutationFormProps<FormValues, MutationResult>) => {
  const { onSubmit, ...useFormReturn } = useMutationForm<
    FormValues,
    MutationResult
  >({
    body,
    config,
    defaultValues,
    endpoint,
    method,
    onComplete,
    refetchQueryKeys,
    schema,
    toast,
  });

  return (
    <FormProvider {...useFormReturn}>
      <Form
        onSubmit={(e) => {
          if (e) e.stopPropagation();
          return onSubmit(e);
        }}
      >
        {typeof children === "function"
          ? createElement(children, {
              ...useFormReturn,
              submit: onSubmit,
            })
          : children}
      </Form>
    </FormProvider>
  );
};
