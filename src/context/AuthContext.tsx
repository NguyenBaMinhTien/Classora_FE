import { log } from "console";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;       // 👈 Thêm — tránh chớp về login khi reload
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function isTokenExpired(token: string | null) {
  if (!token) return true;
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return Date.now() > decoded.exp * 1000;
  } catch {
    return true;
  }
}

function getRoleFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.role || null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 👈 Mặc định true
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
      setRole(getRoleFromToken(token));
    } else {
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      setRole(null);
    }

    setIsLoading(false); // 👈 Check xong mới cho render
  }, []);

  const login = (token: string) => {
    localStorage.setItem("accessToken", token);
    setIsAuthenticated(true);
    const role = getRoleFromToken(token);
    setRole(role);
    if (role === "admin") {
      navigate("/dashboard");
    } else if (role === "teacher") {
      navigate("/schedule");
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    setRole(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};