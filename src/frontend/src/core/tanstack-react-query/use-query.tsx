import { useQuery as useTanstackQuery } from "@tanstack/react-query";

import { api } from "@core/axios";

const QUERY_STALE_TIME = 1000 * 60 * 5;

export const useQuery = (link: string, key: string, queryOptions?: object) => {
  const queryFn = async () => {
    const response = await api.get(link);
    return response.data;
  };

  return useTanstackQuery({
    queryKey: [key],
    queryFn,
    retry: false,
    staleTime: QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });
};
