import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// 👉 Check token hết hạn
function isTokenExpired(token: string | null) {
  if (!token) return true;

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return Date.now() > decoded.exp * 1000;
  } catch {
    return true;
  }
}

// 👉 Lấy role từ token
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
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
      setRole(getRoleFromToken(token)); // 👈 set role khi reload
    } else {
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      setRole(null);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("accessToken", token);
    setIsAuthenticated(true);
    setRole(getRoleFromToken(token)); // 👈 set role khi login
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    setRole(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 👉 Hook dùng chung
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};