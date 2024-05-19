import {
  QueryKey,
  UseMutationOptions,
  useMutation as useTanstackMutation,
} from "@tanstack/react-query";

import { MethodType, RequestConfig, api } from "../axios";
import { queryClient } from "./provider";

type MutateParams<TBody> = {
  link: string;
  method: MethodType;
  body?: TBody;
  config?: RequestConfig;
};

export const useMutation = <TBody, TData = unknown>({
  refetchQueryKeys,
}: {
  refetchQueryKeys?: QueryKey[];
} & Omit<
  UseMutationOptions<TData, unknown, MutateParams<TBody>>,
  "mutationFn"
>) => {
  return useTanstackMutation<TData, unknown, MutateParams<TBody>>({
    mutationFn: async ({ link, method, body, config }) => {
      const response = await api[method](link, body, config);
      return response.data;
    },
    onSuccess: async () => {
      const promises = refetchQueryKeys?.map((queryKey) =>
        queryClient.refetchQueries({ queryKey })
      );
      return await Promise.all(promises || []);
    },
  });
};
