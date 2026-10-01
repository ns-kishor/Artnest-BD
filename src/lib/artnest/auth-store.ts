import { create } from "zustand";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  status: "loading" | "guest" | "authenticated";
  /** Restore the session from the httpOnly cookie on app mount. */
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return typeof data?.error === "string" ? data.error : fallback;
  } catch {
    return fallback;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",

  refresh: async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      set({
        user: data.user ?? null,
        status: data.user ? "authenticated" : "guest",
      });
    } catch {
      set({ user: null, status: "guest" });
    }
  },

  login: async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      throw new Error(await parseError(res, "We couldn't sign you in. Please try again."));
    }
    const data = await res.json();
    set({ user: data.user, status: "authenticated" });
    return data.user as AuthUser;
  },

  register: async (input) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      throw new Error(await parseError(res, "We couldn't create your account. Please try again."));
    }
    const data = await res.json();
    set({ user: data.user, status: "authenticated" });
    return data.user as AuthUser;
  },

  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    set({ user: null, status: "guest" });
  },
}));
