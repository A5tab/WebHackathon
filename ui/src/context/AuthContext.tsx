import { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { getApiErrorMessage } from "@/lib/apiError";

interface User {
  name?: string;
  role?: "admin" | "farmer";
  token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, role: "admin" | "farmer", name?: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔍 Check localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (token && role) {
      setUser({ token, role: role as "admin" | "farmer", name });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      navigate("/");
    };

    window.addEventListener("auth:expired", handleAuthExpired);

    return () => window.removeEventListener("auth:expired", handleAuthExpired);
  }, [navigate]);

  //  Login function
  const login = (token: string, role: "admin" | "farmer", name?: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    if (name) localStorage.setItem("name", name);
    setUser({ token, role, name });

    if (role === "admin") navigate("/admin");
    else navigate("/dashboard");
  };

  // 🚪 Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      // 📨 Make logout request to backend
      await axiosInstance.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // if using cookies
        }
      );
    } catch (error: any) {
      console.warn("Logout API failed:", getApiErrorMessage(error, "Logout failed"));
    } finally {
      localStorage.clear();
      setUser(null);
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
