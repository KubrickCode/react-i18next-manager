import { createElement, ReactNode } from "react";
import {
  Control,
  FieldValues,
  FormProvider,
  FormState,
  UseFormRegister,
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
  schema,
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
    schema,
  });

  return (
    <FormProvider {...useFormReturn}>
      <Form onSubmit={onSubmit}>
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
