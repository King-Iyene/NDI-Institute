import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "teacher" | "admin" | "super_admin";
  avatar?: string | null;
  bio?: string | null;
  phone?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; role?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = "/api";

async function apiFetch(path: string, opts?: RequestInit & { token?: string }) {
  const { token, ...init } = opts || {};
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(init.headers as Record<string, string> || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export { apiFetch };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    try { return localStorage.getItem("ndi_token"); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const data = await apiFetch("/auth/me", { token });
      setUser(data);
    } catch {
      setToken(null); setUser(null);
      try { localStorage.removeItem("ndi_token"); } catch {}
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const data = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    setToken(data.token); setUser(data.user);
    try { localStorage.setItem("ndi_token", data.token); } catch {}
  };

  const register = async (vals: { email: string; password: string; firstName: string; lastName: string; role?: string }) => {
    const data = await apiFetch("/auth/register", { method: "POST", body: JSON.stringify(vals) });
    setToken(data.token); setUser(data.user);
    try { localStorage.setItem("ndi_token", data.token); } catch {}
  };

  const logout = () => {
    setToken(null); setUser(null);
    try { localStorage.removeItem("ndi_token"); } catch {}
  };

  return <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
