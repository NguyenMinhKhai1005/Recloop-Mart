"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { loginUser } from "../../../redux/slices/authSlice";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../../../components/AuthProvider";

interface LoginData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { login: authLogin } = useAuth();
  const { loading: isLoading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const resultAction = await dispatch(loginUser(loginData));
      if (loginUser.fulfilled.match(resultAction)) {
        // Lưu token và user data
        const response = resultAction.payload as { token?: string; user?: any };
        if (response && response.token) {
          // Use AuthProvider to manage auth state
          authLogin(
            response.token,
            response.user || {
              id: 1,
              email: loginData.email,
              fullName: "User",
              role: "admin",
            }
          );
        }
        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          setMessage("");
          router.push("/dashboard");
        }, 1200);
      } else {
        // Nếu lỗi 401 (Unauthorized) thì chuyển sang xác thực OTP
        let errorMsg = resultAction.payload as string;
        let status = undefined;
        // Nếu là JSON.stringify object thì parse ra
        try {
          const parsed = JSON.parse(errorMsg);
          if (parsed && typeof parsed === "object") {
            errorMsg = parsed.message || errorMsg;
            status = parsed.status;
          }
        } catch {}
        if (
          status === 401 ||
          (errorMsg &&
            (errorMsg.toLowerCase().includes("401") ||
              errorMsg.toLowerCase().includes("unauthorized") ||
              errorMsg.toLowerCase().includes("not verified") ||
              errorMsg.toLowerCase().includes("chưa xác thực") ||
              errorMsg.toLowerCase().includes("verify your email")))
        ) {
          sessionStorage.setItem("registerEmail", loginData.email);
          setMessage("Please verify your email to continue.");
          setTimeout(() => {
            setMessage("");
            router.push("/verify-otp-register");
          }, 1200);
        } else {
          setMessage(errorMsg || "Login failed");
        }
      }
    } catch (err) {
      setMessage("Login failed: " + (err as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 shadow-lg rounded-2xl overflow-hidden">
            <Image
              src="/logo-shop.png"
              alt="Logo"
              className="w-full h-full object-cover"
              width={64}
              height={64}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your Recloop Mart account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Message */}
            {(message || error) && (
              <div className="text-center">
                <p
                  className={`text-sm ${
                    message.includes("successful")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message || error}
                </p>
              </div>
            )}
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Don&#39;t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
