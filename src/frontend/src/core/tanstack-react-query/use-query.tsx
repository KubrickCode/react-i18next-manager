import {
  UseQueryOptions,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query";

import { api } from "@core/axios";
import { AxiosError } from "axios";

const QUERY_STALE_TIME = 1000 * 60 * 5;

export const useQuery = <TQueryFnData = unknown, TError = AxiosError>(
  link: string,
  key: string,
  queryOptions?: Omit<
    UseQueryOptions<TQueryFnData, TError>,
    "queryKey" | "queryFn"
  >
) => {
  const queryFn = async (): Promise<TQueryFnData> => {
    const response = await api.get<TQueryFnData>(link);
    return response.data;
  };

  return useTanstackQuery<TQueryFnData, TError>({
    queryKey: [key],
    queryFn,
    retry: false,
    staleTime: QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });
};
