/**
 * Auth store — Zustand store backed by localStorage.
 * Keeps the JWT + decoded user profile synced across the app.
 */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, type AuthUser } from "./api";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  status: "idle" | "loading" | "authenticated" | "error";
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateBranch: (branchId: number, branchName: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      status: "idle",
      error: null,

      login: async (email, password) => {
        set({ status: "loading", error: null });
        try {
          const res = await authApi.login(email, password);
          const user: AuthUser = { email, role: res.role };
          set({
            token: res.token,
            user,
            status: "authenticated",
            error: null,
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Login failed";
          set({ status: "error", error: msg, token: null, user: null });
          throw e;
        }
      },

      logout: () => {
        set({ token: null, user: null, status: "idle", error: null });
      },

      updateBranch: async (branchId) => {
        const { token } = get();
        if (!token) return;
        try {
          await authApi.switchBranch(branchId);
          const u = get().user;
          if (u) {
            set({ user: { ...u, branchId } });
          }
        } catch (e) {
          // swallow — UI can show toast
          throw e;
        }
      },

      clearError: () => set({ error: null, status: "idle" }),
    }),
    {
      name: "zamtrix-auth",
      partialize: (s) => ({ token: s.token, user: s.user, status: s.status }),
    }
  )
);

/** Hook to check auth status without re-rendering on every store change */
export function useIsAuthenticated(): boolean {
  return useAuthStore((s) => !!s.token && s.status === "authenticated");
}
