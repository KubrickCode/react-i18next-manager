import { FieldValues, UseFormReturn } from "react-hook-form";

export type FormProps<FormValues extends FieldValues = FieldValues> = {
  onSubmit: ReturnType<UseFormReturn<FormValues>["handleSubmit"]>;
};

export const Form = <FormValues extends FieldValues>({
  onSubmit,
}: FormProps<FormValues>) => <form onSubmit={onSubmit} />;
