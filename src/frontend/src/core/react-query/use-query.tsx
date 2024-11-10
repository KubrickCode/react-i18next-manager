import {
  UseQueryOptions,
  useQuery as useTanstackQuery,
  useSuspenseQuery as useTanstackSuspenseQuery,
} from "@tanstack/react-query";

import { api, ResponseError } from "../axios";
import { buildApiPath, Endpoint } from "./utils";

const QUERY_STALE_TIME = 1000 * 60 * 5;

export const useQuery = <TQueryFnData = unknown, TError = ResponseError>(
  endpoint: Endpoint,
  queryOptions?: Omit<
    UseQueryOptions<TQueryFnData, TError>,
    "queryKey" | "queryFn"
  >
) => {
  const path = buildApiPath(endpoint);
  const queryFn = async (): Promise<TQueryFnData> => {
    const response = await api.get<TQueryFnData>(path);
    return response.data;
  };

  return useTanstackQuery<TQueryFnData, TError>({
    queryKey: [path],
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
  const path = buildApiPath(endpoint);
  const queryFn = async (): Promise<TQueryFnData> => {
    const response = await api.get<TQueryFnData>(path);
    return response.data;
  };

  return useTanstackSuspenseQuery<TQueryFnData, TError>({
    queryKey: [path],
    queryFn,
    retry: false,
    staleTime: QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });
};
