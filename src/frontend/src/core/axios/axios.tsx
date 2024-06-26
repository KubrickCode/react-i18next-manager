import axios, { AxiosRequestConfig, AxiosError } from "axios";

const API_HOST = window.location.origin + "/api";

export type MethodType = "get" | "post" | "put" | "delete" | "patch";
export type RequestConfig = AxiosRequestConfig;
export type ResponseError = AxiosError;

export const api = axios.create({
  baseURL: API_HOST,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    throw error;
  }
);
