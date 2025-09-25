import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setOtp, verifyOtp, resendOtp } from "../redux/slices/otpSlice";

interface OtpLoginPageProps {
  email: string;
}

const OtpLoginPage: React.FC<OtpLoginPageProps> = ({ email }) => {
  const dispatch = useAppDispatch();
  const { otp, loading, error } = useAppSelector((state) => state.otp);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setOtp(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const result = await dispatch(verifyOtp({ email, otp }));
    if (verifyOtp.fulfilled.match(result)) {
      setMessage("OTP verified successfully!");
      // TODO: redirect to dashboard or home
    } else {
      setMessage((result.payload as string) || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    setMessage("");
    const result = await dispatch(resendOtp({ email }));
    if (resendOtp.fulfilled.match(result)) {
      setMessage("OTP resent successfully!");
    } else {
      setMessage((result.payload as string) || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">
          OTP Verification
        </h2>
        <p className="mb-4 text-center text-gray-600">
          Please enter the OTP sent to your email:{" "}
          <span className="font-medium">{email}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Enter OTP"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        <button
          onClick={handleResend}
          disabled={loading}
          className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50"
        >
          Resend OTP
        </button>
        {(message || error) && (
          <div className="mt-4 text-center">
            <p
              className={`text-sm ${
                message.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message || error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpLoginPage;
