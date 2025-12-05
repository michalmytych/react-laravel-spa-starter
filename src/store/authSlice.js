import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../lib/api";
import { csrf } from "../lib/csrf";

const initialState = {
  user: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password, password_confirmation }, { rejectWithValue }) => {
    try {
      await csrf();
      const response = await api.post("/api/auth/register", {
        name,
        email,
        password,
        password_confirmation,
      });
      return response.data.user;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Unknown error" });
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await csrf();
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });
      return response.data.user;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Unknown error" });
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await csrf();
      await api.post("/api/auth/logout");
      return true;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Unknown error" });
    }
  }
);

// GET CURRENT USER
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/user");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue(null);
      }
      return rejectWithValue({ message: "Unknown error" });
    }
  }
);

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
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || { message: "Register failed" };
      });

    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || { message: "Login failed" };
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
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "idle";
        if (action.payload === null) {
          state.user = null;
        } else {
          state.error = action.payload;
        }
      });
  },
});

export const { resetAuthState } = authSlice.actions;

export default authSlice.reducer;
