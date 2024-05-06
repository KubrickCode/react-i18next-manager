import { useQuery as useTanstackQuery } from "@tanstack/react-query";
import axios from "axios";

const host = window.location.origin + "/api";
const QUERY_STALE_TIME = 1000 * 60 * 5;

export type MethodType = "post" | "patch" | "put" | "delete";

const api = axios.create({
  baseURL: host,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    throw error;
  }
);

export const useQuery = (link: string, key: string, queryOptions?: object) => {
  const queryFn = async () => {
    const response = await api.get(link);
    return response.data;
  };

  return useTanstackQuery({
    queryKey: [key, host + link],
    queryFn,
    retry: false,
    staleTime: QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });
};
