import axios from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';

type LoginPayload = {
  email: string;
  password: string;
};

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

type AuthResponse = {
  user: User;
  accessToken: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  fullName: string;
};

type RefreshResponse = {
  accessToken: string;
  user?: User;
};

type MeResponse = User;

type LogoutResponse = void;

type AuthState = {
  userInfo: User | null;
  accessToken: string | null;
  loading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
};

type ApiError = {
  message: string;
};

const getErrorPayload = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as ApiError | undefined) || {
        message: 'Đăng nhập thất bại',
      }
    );
  }

  return { message: 'Đăng nhập thất bại' };
};

export const handleLogin = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: ApiError }
>(
  'auth/handleLogin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      return data.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

export const handleRegister = createAsyncThunk<
  AuthResponse,
  RegisterPayload,
  { rejectValue: ApiError }
>('auth/handleRegister', async ({ email, password, fullName }, { rejectWithValue }) => {
  try {
    const data = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      fullName,
    });

    return data.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorPayload(error));
  }
});

export const handleRefreshToken = createAsyncThunk<
  RefreshResponse,
  void,
  { rejectValue: ApiError }
>('auth/handleRefreshToken', async (_, { rejectWithValue }) => {
  try {
    const data = await api.post<RefreshResponse>('/auth/refresh');
    return data.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorPayload(error));
  }
});

export const getMe = createAsyncThunk<
  MeResponse,
  void,
  { rejectValue: ApiError }
>('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const data = await api.get<MeResponse>('/auth/me');
    return data.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorPayload(error));
  }
});

export const handleLogout = createAsyncThunk<
  LogoutResponse,
  void,
  { rejectValue: ApiError }
>('auth/handleLogout', async (_, { rejectWithValue }) => {
  try {
    const data = await api.post<LogoutResponse>('/auth/logout');
    return data.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorPayload(error));
  }
});

const initialState: AuthState = {
  userInfo: null,
  accessToken: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearAuth: (state) => {
      state.userInfo = null;
      state.accessToken = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(handleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Đăng nhập thất bại' };
      })

      .addCase(handleRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(handleRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Đăng ký thất bại' };
      })

      .addCase(handleRefreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleRefreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        if (action.payload.user) {
          state.userInfo = action.payload.user;
        }
        state.isAuthenticated = true;
      })
      .addCase(handleRefreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Refresh token thất bại' };
        state.accessToken = null;
        state.isAuthenticated = false;
      })

      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Lấy thông tin user thất bại' };
      })

      .addCase(handleLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleLogout.fulfilled, (state) => {
        state.loading = false;
        state.userInfo = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })
      .addCase(handleLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Đăng xuất thất bại' };
      });
  },
});

export const { setAccessToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;