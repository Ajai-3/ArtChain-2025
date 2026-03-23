import axios from "axios";
import { store } from "../redux/store";
import type { ApiError } from "../types/apiError";
import { logout, setAccessToken } from "../redux/slices/userSlice";
import type { RefreshTokenResponse } from "../types/refreshTokenResponse";
import { adminLogout, setAdminAccessToken } from "../redux/slices/adminSlice";
import toast from "react-hot-toast";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
  let token: string | null = null;

  if (state?.admin?.accessToken) {
    token = state.admin.accessToken;
  } else {
    token = state?.user?.accessToken ?? null;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

const AUTH_ENDPOINTS = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/initialize",
  "/api/v1/auth/refresh-token",
  "/api/v1/admin/login",
];

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject({
        status: 503,
        message: error.code === "ECONNABORTED" ? "Request timed out" : "Network Error",
        isNetworkError: true,
        fullError: error,
      });
    }

    const originalRequest = error.config;
    const status = error.response.status;

    // MANDATORY: Handle 404s IMMEDIATELY to prevent downstream auth logic
    if (status === 404) {
      console.log(`[Axios Interceptor] 404 detected for ${originalRequest.url}. Blocking logout logic.`);
      return Promise.reject({
        status: 404,
        message: error.response.data?.message || "Resource not found",
        fullError: error.response,
      });
    }

    const isAuthEndpoint = AUTH_ENDPOINTS.some((url) =>
      originalRequest.url?.startsWith(url)
    );

    // Only attempt refresh for 401s that aren't on auth endpoints and haven't been tried
    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      console.log(`[Axios Interceptor] 401 detected for ${originalRequest.url}. Attempting token refresh.`);
      
      if (isRefreshing) {
        console.log(`[Axios Interceptor] Refresh already in progress. Queuing request.`);
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const isAdminRequest = originalRequest.url?.includes("/api/v1/admin");
        const refreshEndpoint = "/api/v1/auth/refresh-token";

        const response = await apiClient.get<RefreshTokenResponse>(
          refreshEndpoint,
          { timeout: 30000, _noRetry: true }
        );

        const newToken = response?.data?.accessToken;
        if (!newToken) throw new Error("No accessToken returned");

        console.log(`[Axios Interceptor] Token refresh successful. Resuming requests.`);
        if (isAdminRequest) {
          store.dispatch(setAdminAccessToken(newToken));
        } else {
          store.dispatch(setAccessToken(newToken));
        }

        processQueue(null, newToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        const refreshStatus = refreshError.response?.status;
        console.error(`[Axios Interceptor] Token refresh failed with status ${refreshStatus}:`, refreshError);
        
        processQueue(refreshError, null);
        isRefreshing = false;

        const isAdmin = originalRequest.url?.includes("/api/v1/admin");
        
        // Only log out if the refresh token itself is actually invalid (401 or 403)
        if (refreshStatus === 401 || refreshStatus === 403) {
          console.warn(`[Axios Interceptor] Refresh token invalid. Dispatching logout.`);
          store.dispatch(isAdmin ? adminLogout() : logout());
        }

        return Promise.reject({
          status: 401,
          message: "Session expired. Please log in again.",
          fullError: refreshError,
        });
      }
    }

    if (status === 429) {
      toast.error(error.response.data?.message || "Too many requests. Please try again later", {
        id: "rate-limit-toast",
      });
    }

    return Promise.reject({
      status: status,
      message: error.response.data?.message || error.response.data?.body?.error?.message || "Request failed",
      fullError: error.response,
    });
  }
);

export default apiClient;