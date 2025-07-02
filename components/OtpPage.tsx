import React from 'react';
import { Mail, ArrowLeft, Check } from 'lucide-react';

type OtpPageProps = {
  registerData: { email: string };
  otpData: { otp: string[] };
  handleOtpChange: (index: number, value: string) => void;
  handleOtpKeyDown: (index: number, event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleOtpSubmit: () => void;
  resendOtp: () => void;
  isLoading: boolean;
  message: string;
  setCurrentPage: (page: string) => void;
};

const OtpPage: React.FC<OtpPageProps> = ({
  registerData,
  otpData,
  handleOtpChange,
  handleOtpKeyDown,
  handleOtpSubmit,
  resendOtp,
  isLoading,
  message,
  setCurrentPage
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Mail className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We sent a verification code to<br />
            <span className="font-medium text-gray-800">{registerData.email}</span>
          </p>
        </div>

        {/* OTP Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
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
              type="button"
              onClick={handleOtpSubmit}
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
                <p className={`text-sm ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              </div>
            )}
          </div>

          {/* Resend & Back */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200 space-y-3">
            <p className="text-gray-600">
              Didn&#39;t receive the code?{' '}
              <button
                onClick={resendOtp}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Resend
              </button>
            </p>
            <button
              onClick={() => setCurrentPage('register')}
              className="flex items-center justify-center text-gray-600 hover:text-gray-800 font-medium w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;