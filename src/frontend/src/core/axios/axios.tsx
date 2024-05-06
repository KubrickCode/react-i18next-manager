import axios from "axios";

const API_HOST = window.location.origin + "/api";

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
