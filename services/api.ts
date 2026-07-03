import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_URL_RENDER = process.env.NEXT_PUBLIC_API_URL_RENDER;

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

export type CustomAxiosRequestConfig = InternalAxiosRequestConfig & {
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
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

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
              },
            )
            .then((res) => {
              const newAccessToken = res.data.accessToken;
              setApiAccessToken(newAccessToken);
              return newAccessToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newAccessToken = await refreshPromise;

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
  },
);

export async function get<T>(
  url: string,
  config?: Partial<CustomAxiosRequestConfig>,
): Promise<T> {
  return api.get<T>(url, config as CustomAxiosRequestConfig) as unknown as Promise<T>;
}

export async function post<T>(
  url: string,
  body?: unknown,
  config?: Partial<CustomAxiosRequestConfig>,
): Promise<T> {
  return api.post<T>(url, body, config as CustomAxiosRequestConfig) as unknown as Promise<T>;
}

export async function put<T>(
  url: string,
  body?: unknown,
  config?: Partial<CustomAxiosRequestConfig>,
): Promise<T> {
  return api.put<T>(url, body, config as CustomAxiosRequestConfig) as unknown as Promise<T>;
}

export async function patch<T>(
  url: string,
  body?: unknown,
  config?: Partial<CustomAxiosRequestConfig>,
): Promise<T> {
  return api.patch<T>(url, body, config as CustomAxiosRequestConfig) as unknown as Promise<T>;
}

export async function del<T>(
  url: string,
  config?: Partial<CustomAxiosRequestConfig>,
): Promise<T> {
  return api.delete<T>(url, config as CustomAxiosRequestConfig) as unknown as Promise<T>;
}