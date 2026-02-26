import axios, { AxiosError } from "axios";
import { APP_CONFIG } from "../config/config.ts";

const apiClient = axios.create({
  baseURL: APP_CONFIG.api.baseUrl,
  timeout: APP_CONFIG.api.timeout,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    return Promise.reject(error.response?.data || error.message);
  },
);

export default apiClient;
