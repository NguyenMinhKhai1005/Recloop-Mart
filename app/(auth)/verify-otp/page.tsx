"use client";

import React, { useState, useEffect } from "react";
import { Mail, ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otpData, setOtpData] = useState({ otp: ["", "", "", "", "", ""] });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem("registerEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Redirect to register if no email found
      router.push("/register");
    }
  }, [router]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otpData.otp];
      newOtp[index] = value;
      setOtpData({ otp: newOtp });

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(
          `otp-${index + 1}`
        ) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpData.otp[index] && index > 0) {
      const prevInput = document.getElementById(
        `otp-${index - 1}`
      ) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otpData.otp.join("");
    if (otpString.length !== 6) {
      setMessage("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setMessage("Email verified successfully!");
      setTimeout(() => {
        // Clear stored email
        sessionStorage.removeItem("registerEmail");
        router.push("/login");
        setMessage("");
      }, 1500);
    }, 2000);
  };

  const resendOtp = () => {
    setMessage("OTP resent successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Mail className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We sent a verification code to
            <br />
            <span className="font-medium text-gray-800">{email}</span>
          </p>
        </div>

        {/* OTP Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter 6-digit verification code
              </label>
              <div className="flex justify-center space-x-3">
                {otpData.otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Check className="w-5 h-5 mr-2" />
                  Verify Email
                </div>
              )}
            </button>

            {/* Message */}
            {message && (
              <div className="text-center">
                <p
                  className={`text-sm ${
                    message.includes("successful")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              </div>
            )}
          </form>

          {/* Resend & Back */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200 space-y-3">
            <p className="text-gray-600">
              Didn&#39;t receive the code?{" "}
              <button
                onClick={resendOtp}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Resend
              </button>
            </p>
            <Link
              href="/register"
              className="flex items-center justify-center text-gray-600 hover:text-gray-800 font-medium w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
