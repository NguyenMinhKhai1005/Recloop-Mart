"use client";
import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import OtpLoginPage from "../../../components/OtpLoginPage";

export default function VerifyOtpLoginPage() {
  // Lấy email từ redux hoặc query param nếu cần
  const email = useAppSelector((state) => state.otp.email);
  // Nếu chưa có email thì có thể redirect về login hoặc hiển thị thông báo
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-red-600 font-medium">
            No email found for OTP verification.
          </p>
        </div>
      </div>
    );
  }
  return <OtpLoginPage email={email} />;
}
