import {
  QueryKey,
  UseMutationOptions,
  useMutation as useTanstackMutation,
} from "@tanstack/react-query";

import { MethodType, RequestConfig, api } from "../axios";
import { queryClient } from "./provider";
import { useToast } from "../toast";

type MutateParams<TBody> = {
  link: string;
  method: MethodType;
  body?: TBody;
  config?: RequestConfig;
};

type ErrorResponse = {
  response: {
    data: {
      message: string;
    };
  };
};

export const useMutation = <TBody, TData = unknown>({
  refetchQueryKeys,
  toastMessage,
}: {
  refetchQueryKeys?: QueryKey[];
  toastMessage?: string;
} & Omit<
  UseMutationOptions<TData, unknown, MutateParams<TBody>>,
  "mutationFn"
>) => {
  const toast = useToast();

  return useTanstackMutation<TData, ErrorResponse, MutateParams<TBody>>({
    mutationFn: async ({ link, method, body, config }) => {
      const response = await api[method](link, body, config);
      return response.data;
    },
    onSuccess: async () => {
      toastMessage && toast({ description: toastMessage });
      const promises = refetchQueryKeys?.map((queryKey) =>
        queryClient.refetchQueries({ queryKey })
      );
      return await Promise.all(promises || []);
    },
    onError: (error) => {
      toast({ description: error.response.data.message, status: "error" });
      console.error(error);
    },
  });
};
