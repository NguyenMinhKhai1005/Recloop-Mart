"use client";

import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";
import { Shield, ArrowLeft, LogOut } from "lucide-react";

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>

        {user && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Current User:</p>
            <p className="font-medium text-gray-900">{user.fullName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500">Role: {user.role}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Home</span>
          </button>

          <button
            onClick={() => router.back()}
            className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go Back
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>If you believe this is an error, please contact your administrator.</p>
        </div>
      </div>
    </div>
  );
}
