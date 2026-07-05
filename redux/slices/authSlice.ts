import axios from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  clearApiAccessToken,
  get,
  post,
  setApiAccessToken,
} from "../../services/api";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  fullName: string;
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

type RefreshResponse = {
  accessToken: string;
  user?: User;
};

type MeResponse = User;

type LogoutResponse = {
  message?: string;
};

type ApiError = {
  message: string;
};

type AuthState = {
  userInfo: User | null;
  accessToken: string | null;
  loading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
  bootstrapped: boolean;
};

const getErrorPayload = (error: unknown, fallback: string): ApiError => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as ApiError | undefined) || {
        message: fallback,
      }
    );
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    return { message: String((error as { message: unknown }).message) };
  }

  return { message: fallback };
};

export const handleLogin = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: ApiError }
>("auth/handleLogin", async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await post<AuthResponse>(
      "/auth/login",
      { email, password },
      { skipAuthRefresh: true },
    );

    setApiAccessToken(data.accessToken);
    return data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorPayload(error, "Đăng nhập thất bại"));
  }
});

export const handleRegister = createAsyncThunk<
  AuthResponse,
  RegisterPayload,
  { rejectValue: ApiError }
>(
  "auth/handleRegister",
  async ({ email, password, fullName }, { rejectWithValue }) => {
    try {
      const data = await post<AuthResponse>(
        "/auth/register",
        { email, password, fullName },
        { skipAuthRefresh: true },
      );

      setApiAccessToken(data.accessToken);
      return data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorPayload(error, "Đăng ký thất bại"));
    }
  },
);

export const handleRefreshToken = createAsyncThunk<
  RefreshResponse,
  void,
  { rejectValue: ApiError }
>("auth/handleRefreshToken", async (_, { rejectWithValue }) => {
  try {
    const data = await post<RefreshResponse>(
      "/auth/refresh",
      undefined,
      { skipAuthRefresh: true },
    );

    setApiAccessToken(data.accessToken);
    return data;
  } catch (error: unknown) {
    clearApiAccessToken();
    return rejectWithValue(getErrorPayload(error, "Refresh token thất bại"));
  }
});

export const getMe = createAsyncThunk<
  MeResponse,
  void,
  { rejectValue: ApiError }
>("auth/getMe", async (_, { rejectWithValue }) => {
  try {
    const data = await get<MeResponse>("/auth/me");
    return data;
  } catch (error: unknown) {
    return rejectWithValue(
      getErrorPayload(error, "Lấy thông tin user thất bại"),
    );
  }
});

export const handleLogout = createAsyncThunk<
  LogoutResponse,
  void,
  { rejectValue: ApiError }
>("auth/handleLogout", async (_, { rejectWithValue }) => {
  try {
    const data = await post<LogoutResponse>(
      "/auth/logout",
      undefined,
      { skipAuthRefresh: true },
    );

    clearApiAccessToken();
    return data;
  } catch (error: unknown) {
    clearApiAccessToken();
    return rejectWithValue(getErrorPayload(error, "Đăng xuất thất bại"));
  }
});

const initialState: AuthState = {
  userInfo: null,
  accessToken: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  bootstrapped: false,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;

      if (action.payload) {
        setApiAccessToken(action.payload);
      } else {
        clearApiAccessToken();
      }
    },
    clearAuth: (state) => {
      state.userInfo = null;
      state.accessToken = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      state.bootstrapped = true;
      clearApiAccessToken();
    },
    setBootstrapped: (state, action: PayloadAction<boolean>) => {
      state.bootstrapped = action.payload;
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
        state.bootstrapped = true;
      })
      .addCase(handleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Đăng nhập thất bại" };
        state.userInfo = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.bootstrapped = true;
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
        state.bootstrapped = true;
      })
      .addCase(handleRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Đăng ký thất bại" };
        state.userInfo = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.bootstrapped = true;
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
        state.bootstrapped = true;
      })
      .addCase(handleRefreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Refresh token thất bại" };
        state.userInfo = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.bootstrapped = true;
      })

      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.isAuthenticated = true;
        state.bootstrapped = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || { message: "Lấy thông tin user thất bại" };
        state.userInfo = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.bootstrapped = true;
        clearApiAccessToken();
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
        state.bootstrapped = true;
      })
      .addCase(handleLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Đăng xuất thất bại" };
        state.userInfo = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.bootstrapped = true;
      });
  },
});

export const { setAccessToken, clearAuth, setBootstrapped } =
  authSlice.actions;

export default authSlice.reducer;