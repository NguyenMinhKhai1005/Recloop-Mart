import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { RegisterPayload, LoginPayload } from "../../service/authService";
import {
  register as apiRegister,
  login as apiLogin,
} from "../../service/authService";
import { setEmail } from "./otpSlice";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, thunkAPI) => {
    try {
      const data = await apiRegister(payload);
      // Lưu email vào otp slice để dùng cho xác thực OTP
      thunkAPI.dispatch(setEmail(payload.email));
      return data;
    } catch (err) {
      if (err instanceof Error) return thunkAPI.rejectWithValue(err.message);
      return thunkAPI.rejectWithValue("Unknown error");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const data = await apiLogin(payload);
      return data;
    } catch (err: any) {
      // Nếu là object có status và message thì trả về luôn
      if (
        err &&
        typeof err === "object" &&
        "status" in err &&
        "message" in err
      ) {
        return rejectWithValue(
          JSON.stringify({ status: err.status, message: err.message })
        );
      }
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue("Unknown error");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        if (action.payload.token) {
          localStorage.setItem("authToken", action.payload.token);
          localStorage.setItem("authUser", JSON.stringify(action.payload));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
