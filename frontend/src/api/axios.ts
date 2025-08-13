import axios from "axios";
import { store } from "../redux/store";
import { logout, setAccessToken } from "../redux/slices/userSlice";
import { adminLogout, setAdminAccessToken } from "../redux/slices/adminSlice";

interface RefreshTokenResponse {
  accessToken: string;
  expiresIn?: number;
  tokenType?: string;
}

interface ApiError {
  status: number;
  message: string;
  isNetworkError?: boolean;
  fullError?: any;
}

const MAX_REFRESH_RETRIES = 3;
let refreshRetryCount = 0;

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

declare module "axios" {
  interface AxiosRequestConfig {
    _retry?: boolean;
    _noRetry?: boolean;
  }
}

apiClient.interceptors.request.use((config) => {
  try {
    const state = store.getState();
    const isAdminRequest = config.url?.includes("/api/v1/admin");
    const token = isAdminRequest
      ? state?.admin?.accessToken ?? null
      : state?.user?.accessToken ?? null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error("Request interceptor error:", error);
    return config;
  }
});
const AUTH_ENDPOINTS = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/admin/login',
];

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (!error.response) {
      const networkError: ApiError = {
        status: 503,
        message: error.code === "ECONNABORTED" ? "Request timed out" : "Network Error",
        isNetworkError: true,
        fullError: error
      };

      if (error.message && error.message.includes("Failed to fetch")) {
        networkError.message = "CORS error: Backend might be unavailable or misconfigured";
      }

      return Promise.reject(networkError);
    }

    const originalRequest = error.config;

    const isAuthEndpoint = AUTH_ENDPOINTS.some((url) =>
      originalRequest.url?.startsWith(url)
    );

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest._noRetry &&
      refreshRetryCount < MAX_REFRESH_RETRIES &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
      refreshRetryCount++;

      try {
        const isAdminRequest = originalRequest.url?.includes("/api/v1/admin");
        const refreshEndpoint = isAdminRequest
          ? "/api/v1/admin/refresh-token"
          : "/api/v1/auth/refresh-token";

        const response = await apiClient.get<RefreshTokenResponse>(refreshEndpoint, {
          timeout: 30000,
          _noRetry: true
        });

        const newToken = response?.accessToken;

        if (isAdminRequest) {
          store.dispatch(setAdminAccessToken(newToken));
        } else {
          store.dispatch(setAccessToken(newToken));
        }

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        refreshRetryCount = 0;

        return apiClient(originalRequest);
      } catch (refreshError) {
        if (refreshRetryCount >= MAX_REFRESH_RETRIES) {
          const isAdmin = originalRequest.url?.includes("/api/v1/admin");
          store.dispatch(isAdmin ? adminLogout() : logout());
        }

        return Promise.reject({
          status: 401,
          message: refreshRetryCount >= MAX_REFRESH_RETRIES
            ? "Session expired. Please log in again."
            : "Refreshing session failed.",
          fullError: refreshError
        });
      }
    }

    return Promise.reject({
      status: error.response.status,
      message: error.response.data?.error?.message || "Request failed",
      fullError: error.response
    });
  }
);


export default apiClient;