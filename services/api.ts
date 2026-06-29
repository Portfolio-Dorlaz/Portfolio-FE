import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

const API_DEV = process.env.NEXT_PUBLIC_API_URL;

let accessToken: string | null = null;
let refreshPromise: Promise<{ accessToken: string }> | null = null;

type ApiErrorResponse = {
  message?: string;
};

type RetryAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

export const api = axios.create({
  baseURL: API_DEV,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
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
    const isRefreshRequest = originalRequest.url?.includes('/auth/refresh');

    if (status === 401 && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post<{ accessToken: string }>(
              `${API_DEV}/auth/refresh`,
              {},
              {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
            .then((res) => res.data);
        }

        const refreshData = await refreshPromise;
        refreshPromise = null;

        const newAccessToken = refreshData.accessToken;
        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest as AxiosRequestConfig);
      } catch (refreshError) {
        refreshPromise = null;
        clearAccessToken();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject({
      status,
      message: error.response.data?.message || 'Request failed',
      data: error.response.data,
    });
  }
);