import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL_RENDER ||
  process.env.NEXT_PUBLIC_API_URL_DEV ||
  "";

type ApiErrorResponse = {
  message?: string;
};

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

type RefreshResponse = {
  accessToken: string;
  user?: User;
};

export type CustomAxiosRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

const AUTH_BYPASS_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
];

export const setApiAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getApiAccessToken = () => accessToken;

export const clearApiAccessToken = () => {
  accessToken = null;
};

const shouldSkipRefresh = (config?: CustomAxiosRequestConfig) => {
  if (!config) return true;
  if (config.skipAuthRefresh) return true;

  const url = config.url || "";
  return AUTH_BYPASS_PATHS.some((path) => url.includes(path));
};

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const refreshAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<RefreshResponse>(
        `${API_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) {
          throw new Error("Không nhận được access token mới");
        }

        setApiAccessToken(newAccessToken);
        return newAccessToken;
      })
      .catch((error) => {
        clearApiAccessToken();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const initializeAuth = async () => {
  if (accessToken) return accessToken;

  try {
    return await refreshAccessToken();
  } catch {
    clearApiAccessToken();
    return null;
  }
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
          skipAuthRefresh?: boolean;
        })
      | undefined;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (
      status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh(originalRequest)
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        if (!originalRequest.headers) {
          originalRequest.headers = {} as InternalAxiosRequestConfig["headers"];
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        clearApiAccessToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject({
      status,
      message: error.response.data?.message || "Request failed",
      data: error.response.data,
    });
  },
);

export function get<T>(
  url: string,
  config?: CustomAxiosRequestConfig,
): Promise<T> {
  return api.get<T, T>(url, config);
}

export function post<T>(
  url: string,
  body?: unknown,
  config?: CustomAxiosRequestConfig,
): Promise<T> {
  return api.post<T, T>(url, body, config);
}

export function put<T>(
  url: string,
  body?: unknown,
  config?: CustomAxiosRequestConfig,
): Promise<T> {
  return api.put<T, T>(url, body, config);
}

export function patch<T>(
  url: string,
  body?: unknown,
  config?: CustomAxiosRequestConfig,
): Promise<T> {
  return api.patch<T, T>(url, body, config);
}

export function del<T>(
  url: string,
  config?: CustomAxiosRequestConfig,
): Promise<T> {
  return api.delete<T, T>(url, config);
}