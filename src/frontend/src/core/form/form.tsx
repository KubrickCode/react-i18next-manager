import { PropsWithChildren } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export type FormProps<FormValues extends FieldValues = FieldValues> = {
  onSubmit: ReturnType<UseFormReturn<FormValues>["handleSubmit"]>;
} & PropsWithChildren;

export const Form = <FormValues extends FieldValues>({
  children,
  onSubmit,
}: FormProps<FormValues>) => <form onSubmit={onSubmit}>{children}</form>;
