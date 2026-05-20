import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Role, BU } from "./role-context";

export type AuthUser = {
  email: string;
  name: string;
  role: Role;
  managedBU: BU | null;
};

type AuthCtx = {
  user: AuthUser | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
};

const CREDENTIALS: Array<{ email: string; password: string; user: AuthUser }> = [
  {
    email: "hr@mettus.co.za",
    password: "mettus2026",
    user: { email: "hr@mettus.co.za", name: "Kim Kotze", role: "HR", managedBU: null },
  },
  {
    email: "exec@mettus.co.za",
    password: "mettus2026",
    user: { email: "exec@mettus.co.za", name: "Marosha Pather", role: "Executive", managedBU: null },
  },
  {
    email: "manager@mettus.co.za",
    password: "mettus2026",
    user: {
      email: "manager@mettus.co.za",
      name: "Ziyaad Raymond",
      role: "Manager",
      managedBU: "Technology",
    },
  },
];

const SESSION_KEY = "mettus_auth_user";

function loadSession(): AuthUser | null {
  try {
    const raw =
      typeof sessionStorage !== "undefined" ? sessionStorage.getItem(SESSION_KEY) : null;
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

const AuthCtxObj = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadSession);

  const login = useCallback((email: string, password: string) => {
    const match = CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password,
    );
    if (!match) return { ok: false, error: "Invalid email or password." };
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(match.user));
    } catch {}
    setUser(match.user);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    setUser(null);
  }, []);

  return <AuthCtxObj.Provider value={{ user, login, logout }}>{children}</AuthCtxObj.Provider>;
}

export function useAuth() {
  const c = useContext(AuthCtxObj);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
