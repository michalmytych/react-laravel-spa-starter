import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { api } from "../lib/api";
import { csrf } from "../lib/csrf";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface ErrorPayload {
  message?: string;
  [key: string]: unknown;
}

type Status = "idle" | "loading" | "succeeded" | "failed";

interface AuthState {
  user: User | null;
  status: Status;
  error: ErrorPayload | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

// REGISTER
export const registerUser = createAsyncThunk<
  User,
  {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  },
  { rejectValue: ErrorPayload }
>("auth/registerUser", async (payload, { rejectWithValue }) => {
  try {
    await csrf();
    const response = await api.post("/api/auth/register", payload);
    return response.data.user as User;
  } catch (err) {
    const error = err as AxiosError<any>;
    if (error.response?.data) {
      return rejectWithValue(error.response.data as ErrorPayload);
    }
    return rejectWithValue({ message: "Unknown error" });
  }
});

// LOGIN
export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: ErrorPayload }
>("auth/loginUser", async (payload, { rejectWithValue }) => {
  try {
    await csrf();
    const response = await api.post("/api/auth/login", payload);
    return response.data.user as User;
  } catch (err) {
    const error = err as AxiosError<any>;
    if (error.response?.data) {
      return rejectWithValue(error.response.data as ErrorPayload);
    }
    return rejectWithValue({ message: "Unknown error" });
  }
});

// LOGOUT
export const logoutUser = createAsyncThunk<
  boolean,
  void,
  { rejectValue: ErrorPayload }
>("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    await csrf();
    await api.post("/api/auth/logout");
    return true;
  } catch (err) {
    const error = err as AxiosError<any>;
    if (error.response?.data) {
      return rejectWithValue(error.response.data as ErrorPayload);
    }
    return rejectWithValue({ message: "Unknown error" });
  }
});

// GET CURRENT USER
export const fetchUser = createAsyncThunk<
  User,
  void,
  { rejectValue: ErrorPayload | null }
>("auth/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/user");
    return response.data as User;
  } catch (err) {
    const error = err as AxiosError<any>;
    if (error.response?.status === 401) {
      return rejectWithValue(null);
    }
    return rejectWithValue({ message: "Unknown error" });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState(state) {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.status = "succeeded";
          state.user = action.payload;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || { message: "Register failed" };
      });

    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.status = "succeeded";
          state.user = action.payload;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || { message: "Login failed" };
      });

    // LOGOUT
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
    });

    // FETCH USER
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.status = "succeeded";
          state.user = action.payload;
        }
      )
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "idle";
        if (action.payload === null) {
          state.user = null;
        } else if (action.payload) {
          state.error = action.payload;
        }
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
