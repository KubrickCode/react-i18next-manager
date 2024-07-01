import {
  UseQueryOptions,
  useQuery as useTanstackQuery,
  useSuspenseQuery as useTanstackSuspenseQuery,
} from "@tanstack/react-query";

import { api, ResponseError } from "../axios";

const QUERY_STALE_TIME = 1000 * 60 * 5;

export const useQuery = <TQueryFnData = unknown, TError = ResponseError>(
  endpoint: string,
  key: string | string[],
  queryOptions?: Omit<
    UseQueryOptions<TQueryFnData, TError>,
    "queryKey" | "queryFn"
  >
) => {
  const queryFn = async (): Promise<TQueryFnData> => {
    const response = await api.get<TQueryFnData>(endpoint);
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

export const useSuspenseQuery = <
  TQueryFnData = unknown,
  TError = ResponseError
>(
  endpoint: string,
  key: string | string[],
  queryOptions?: Omit<
    UseQueryOptions<TQueryFnData, TError>,
    "queryKey" | "queryFn"
  >
) => {
  const queryFn = async (): Promise<TQueryFnData> => {
    const response = await api.get<TQueryFnData>(endpoint);
    return response.data;
  };

  return useTanstackSuspenseQuery<TQueryFnData, TError>({
    queryKey: [key],
    queryFn,
    retry: false,
    staleTime: QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });
};
