import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import otpReducer from "./slices/otpSlice";
import categoryReducer from "./slices/categorySlice";
import productReducer from "./slices/productSlice";
import reportReducer from "./slices/reportSlice";

import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    otp: otpReducer,
    category: categoryReducer,
    product: productReducer,
    report: reportReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
