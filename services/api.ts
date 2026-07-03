import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

const API_URL_RENDER = process.env.NEXT_PUBLIC_API_URL_RENDER;

type ApiErrorResponse = {
  message?: string;
};

type RefreshResponse = {
  accessToken: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
};

type RetryAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

let accessToken: string | null = null;
let refreshPromise: Promise<RefreshResponse> | null = null;

const AUTH_EXCLUDED_PATHS = [
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

export const api = axios.create({
  baseURL: API_URL_RENDER,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryAxiosRequestConfig | undefined;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const requestUrl = originalRequest.url || "";

    const shouldSkipRefresh =
      !!originalRequest.skipAuthRefresh ||
      AUTH_EXCLUDED_PATHS.some((path) => requestUrl.includes(path));

    if (status === 401 && !originalRequest._retry && !shouldSkipRefresh) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post<RefreshResponse>(
              `${API_URL_RENDER}/auth/refresh`,
              {},
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
            .then((res) => res.data)
            .finally(() => {
              refreshPromise = null;
            });
        }

        const refreshData = await refreshPromise;
        const newAccessToken = refreshData.accessToken;

        setApiAccessToken(newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

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
  }
);

export async function get<T>(url: string, config?: RetryAxiosRequestConfig): Promise<T> {
  return api.get<T>(url, config).then((res) => res as unknown as T);
}

export async function post<T>(
  url: string,
  body?: unknown,
  config?: RetryAxiosRequestConfig
): Promise<T> {
  return api.post<T>(url, body, config).then((res) => res as unknown as T);
}

export async function put<T>(
  url: string,
  body?: unknown,
  config?: RetryAxiosRequestConfig
): Promise<T> {
  return api.put<T>(url, body, config).then((res) => res as unknown as T);
}

export async function del<T>(url: string, config?: RetryAxiosRequestConfig): Promise<T> {
  return api.delete<T>(url, config).then((res) => res as unknown as T);
}