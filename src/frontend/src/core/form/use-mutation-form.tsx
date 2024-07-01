import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, Resolver, useForm } from "react-hook-form";

import { MutateParams, UseMutationProps, useMutation } from "../react-query";

export type UseMutationFormProps<TBody, TData> = UseMutationProps<
  TBody,
  TData
> & {
  mutateParams: MutateParams<TBody>;
};

export const useMutationForm = <
  TBody extends FieldValues = FieldValues,
  TData = unknown
>({
  mutateParams,
  refetchQueryKeys,
  schema,
  toastMessage,
}: UseMutationFormProps<TBody, TData>) => {
  const { mutate } = useMutation({
    refetchQueryKeys,
    toastMessage,
  });

  const { handleSubmit, ...otherProps } = useForm<TBody>({
    ...(schema
      ? {
          resolver: zodResolver(schema) as Resolver<TBody>,
        }
      : {}),
  });

  const onValid = (data: TBody) => {
    mutate({
      ...mutateParams,
      body: data,
    });
  };

  return {
    handleSubmit, // FormProvider 를 위해서 필요함.
    onSubmit: handleSubmit(onValid),
    ...otherProps,
  };
};
