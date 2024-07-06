import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, Resolver, useForm } from "react-hook-form";

import { MutateParams, UseMutationProps, useMutation } from "../react-query";

export type UseMutationFormProps<TBody, TData> = UseMutationProps<
  TBody,
  TData
> &
  MutateParams<TBody> & {
    defaultValues?: DefaultValues<TBody>;
    onComplete?: () => void;
  };

export const useMutationForm = <
  TBody extends FieldValues = FieldValues,
  TData = unknown
>({
  defaultValues,
  onComplete,
  refetchQueryKeys,
  schema,
  toast,
  ...mutateParams
}: UseMutationFormProps<TBody, TData>) => {
  const { mutate } = useMutation({
    refetchQueryKeys,
    toast,
  });

  const { handleSubmit, ...otherProps } = useForm<TBody>({
    defaultValues,
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
    onComplete?.();
  };

  return {
    handleSubmit, // FormProvider 를 위해서 필요함.
    onSubmit: handleSubmit(onValid),
    ...otherProps,
  };
};
