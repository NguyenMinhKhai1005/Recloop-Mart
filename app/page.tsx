"use client";
import React, { useState } from "react";
import UserManagement from "./components/UserManagement";
import ProductManagement from "./components/ProductManagement";
import ReportsFlags from "./components/ReportsFlags";
import CategoryManagement from "./components/CategoryManagement";
import {
  LayoutDashboard,
  Users,
  List,
  Flag,
  Settings,
  Search,
  Bell,
  Menu,
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems = [
    { id: "users", label: "User Management", icon: Users },
    { id: "products", label: "Product Management", icon: List },
    { id: "reports", label: "Reports & Flags", icon: Flag },
    { id: "categories", label: "Category Management", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white shadow-lg transition-all duration-300`}
      >
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-gray-800">Recloop Mart</h1>
            )}
          </div>
        </div>

        <nav className="mt-8">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-100 border-r-2 border-blue-600"
                    : ""
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    activeTab === item.id ? "text-blue-600" : "text-gray-600"
                  }`}
                />
                {sidebarOpen && (
                  <span
                    className={`ml-3 ${
                      activeTab === item.id
                        ? "text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome back, Admin
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-600 text-black placeholder-gray-700 font-medium rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "users" && <UserManagement />}
          {activeTab === "products" && <ProductManagement />}
          {activeTab === "reports" && <ReportsFlags />}
          {activeTab === "categories" && <CategoryManagement />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
