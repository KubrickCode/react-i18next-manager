import axios, { AxiosRequestConfig, AxiosError } from "axios";

export type MethodType = "get" | "post" | "put" | "delete" | "patch";
export type RequestConfig = AxiosRequestConfig;
export type ResponseError = AxiosError;

export const api = axios.create({
  baseURL: window.location.origin,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    throw error;
  }
);
