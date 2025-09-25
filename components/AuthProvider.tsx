"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("authUser");

        if (storedToken) {
          setToken(storedToken);

          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
            } catch (error) {
              // Clear corrupted data
              localStorage.removeItem("authToken");
              localStorage.removeItem("authUser");
            }
          }
        }
      } catch (error) {
        // Clear all auth data on error
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      } finally {
        setIsLoading(false);
      }
    };

    // Delay to ensure localStorage is available
    const timer = setTimeout(initAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);

    localStorage.setItem("authToken", newToken);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");

    router.push("/login");
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
