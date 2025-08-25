import axios from "axios";
import { store } from "../redux/store";
import { logout, setAccessToken } from "../redux/slices/userSlice";
import { adminLogout, setAdminAccessToken } from "../redux/slices/adminSlice";
import type { ApiError } from "../types/apiError";
import type { RefreshTokenResponse } from "../types/refreshTokenResponse";


const MAX_REFRESH_RETRIES = 3;
let refreshRetryCount = 0;

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

declare module "axios" {
  interface AxiosRequestConfig {
    _retry?: boolean;
    _noRetry?: boolean;
  }
}

apiClient.interceptors.request.use((config) => {
  const state = store.getState();
  const isAdminRequest = config.url?.includes("/api/v1/admin");
  const isUserRequest = config.url?.includes("/api/v1/user");
  const token = isAdminRequest
    ? state?.admin?.accessToken ?? null
    : state?.user?.accessToken ?? null;
  const userId = isUserRequest ? state?.user?.user?.id ?? null : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (isUserRequest && userId) config.headers["x-user-id"] = userId;
  return config;
});

const AUTH_ENDPOINTS = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/admin/login",
];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject({
        status: 503,
        message:
          error.code === "ECONNABORTED" ? "Request timed out" : "Network Error",
        isNetworkError: true,
        fullError: error,
      });
    }

    const originalRequest = error.config;
    const isAuthEndpoint = AUTH_ENDPOINTS.some((url) =>
      originalRequest.url?.startsWith(url)
    );

    const errorData = error.response?.data || {};
    const errorMessage =
      errorData?.body?.error?.message || errorData?.error || errorData?.message || error.message || "Request failed";
    const status = error.response?.status || 500;

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      let refreshTokenSuccess = false;

      try {
        const isAdminRequest = originalRequest.url?.includes("/api/v1/admin");
        const refreshResponse = await refreshClient.get<RefreshTokenResponse>(
          "/api/v1/auth/refresh-token"
        );
        const newToken = refreshResponse.data?.accessToken;

        if (!newToken) throw new Error("No accessToken returned");

        if (isAdminRequest) store.dispatch(setAdminAccessToken(newToken));
        else store.dispatch(setAccessToken(newToken));

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        refreshTokenSuccess = true;

        // retry original request with new token
        return apiClient(originalRequest);
      } catch (refreshError) {
        const isAdmin = originalRequest.url?.includes("/api/v1/admin");
        store.dispatch(isAdmin ? adminLogout() : logout());
        return Promise.reject({
          status: 401,
          message: "Session expired. Please log in again.",
          fullError: refreshError,
        });
      }
    }

    return Promise.reject({
      status,
      message: errorMessage,
      fullError: error.response,
    });
  }
);


export default apiClient;
