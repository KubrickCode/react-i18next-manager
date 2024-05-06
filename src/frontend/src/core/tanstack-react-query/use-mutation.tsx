import { useMutation as useTanstackMutation } from "@tanstack/react-query";

import { MethodType, RequestConfig, api } from "@core/axios";

export const useMutation = ({
  link,
  method,
  body,
  config,
}: {
  link: string;
  method: MethodType;
  body?: object;
  config?: RequestConfig;
}) => {
  return useTanstackMutation({
    mutationFn: async () => {
      const response = await api[method](link, body, config);
      return response.data;
    },
  });
};
