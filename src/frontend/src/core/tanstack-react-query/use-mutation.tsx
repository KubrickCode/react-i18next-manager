import { useMutation as useTanstackMutation } from "@tanstack/react-query";

import { MethodType, RequestConfig, api } from "@core/axios";

type MutateParams = {
  link: string;
  method: MethodType;
  body?: object;
  config?: RequestConfig;
};

export const useMutation = () => {
  return useTanstackMutation({
    mutationFn: async ({ link, method, body, config }: MutateParams) => {
      const response = await api[method](link, body, config);
      return response.data;
    },
  });
};
