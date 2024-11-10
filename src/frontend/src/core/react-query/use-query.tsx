import {
  UseQueryOptions,
  useQuery as useTanstackQuery,
  useSuspenseQuery as useTanstackSuspenseQuery,
} from "@tanstack/react-query";

import { api, ResponseError } from "../axios";
import { buildUrl, Endpoint } from "./utils";

const QUERY_STALE_TIME = 1000 * 60 * 5;

export const useQuery = <TQueryFnData = unknown, TError = ResponseError>(
  endpoint: Endpoint,
  queryOptions?: Omit<
    UseQueryOptions<TQueryFnData, TError>,
    "queryKey" | "queryFn"
  >
) => {
  const url = buildUrl(endpoint);
  const queryFn = async (): Promise<TQueryFnData> => {
    const response = await api.get<TQueryFnData>(url);
    return response.data;
  };

  return useTanstackQuery<TQueryFnData, TError>({
    queryKey: [url],
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
  endpoint: Endpoint,
  queryOptions?: Omit<
    UseQueryOptions<TQueryFnData, TError>,
    "queryKey" | "queryFn"
  >
) => {
  const url = buildUrl(endpoint);
  const queryFn = async (): Promise<TQueryFnData> => {
    const response = await api.get<TQueryFnData>(url);
    return response.data;
  };

  return useTanstackSuspenseQuery<TQueryFnData, TError>({
    queryKey: [url],
    queryFn,
    retry: false,
    staleTime: QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });
};
