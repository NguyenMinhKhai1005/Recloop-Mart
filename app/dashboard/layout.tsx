"use client";

import ProtectedRoute from "../../components/ProtectedRoute";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={["admin", "Admin"]}>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </ProtectedRoute>
  );
}
