import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  VerifyEmailPayload,
  ResendOtpPayload,
} from "../../service/authService";
import {
  verifyEmail as apiVerifyEmail,
  resendOtp as apiResendOtp,
} from "../../service/authService";

interface OtpState {
  email: string;
  otp: string;
  verified: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: OtpState = {
  email: "",
  otp: "",
  verified: false,
  loading: false,
  error: null,
};

export const resendOtp = createAsyncThunk(
  "otp/resendOtp",
  async (payload: ResendOtpPayload, { rejectWithValue }) => {
    try {
      const data = await apiResendOtp(payload);
      return data;
    } catch (err) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue("Unknown error");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "otp/verifyOtp",
  async (payload: VerifyEmailPayload, { rejectWithValue }) => {
    try {
      const data = await apiVerifyEmail(payload);
      return data;
    } catch (err) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue("Unknown error");
    }
  }
);

const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setOtp(state, action: PayloadAction<string>) {
      state.otp = action.payload;
    },
    resetOtpState(state) {
      state.email = "";
      state.otp = "";
      state.verified = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.verified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setEmail, setOtp, resetOtpState } = otpSlice.actions;
export default otpSlice.reducer;
