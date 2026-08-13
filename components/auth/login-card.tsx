"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";

interface LoginCardProps {
  /** Redirect target after successful login */
  redirectTo?: string;
  /** Compact layout (when shown inside a dialog) */
  compact?: boolean;
}

/**
 * Login form for Zamtrix ERP.
 *
 * Usage in a route (recommended for local Next.js setup):
 *
 *   // app/login/page.tsx
 *   import { LoginCard } from "@/components/auth/login-card";
 *   export default function LoginPage() {
 *     return (
 *       <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
 *         <LoginCard redirectTo="/dashboard" />
 *       </div>
 *     );
 *   }
 */
export function LoginCard({ redirectTo = "/", compact = false }: LoginCardProps) {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const status = useAuthStore((s) => s.status);
  const storeError = useAuthStore((s) => s.error);

  const [email, setEmail] = useState("admin@erp.com");
  const [password, setPassword] = useState("admin123");
  const [localError, setLocalError] = useState<string | null>(null);

  const isLoading = status === "loading";
  const error = localError || storeError;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    try {
      await login(email, password);
      toast.success("Welcome back!", { description: "You are now signed in." });
      router.push(redirectTo);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setLocalError(msg);
      toast.error("Login failed", { description: msg });
    }
  }

  return (
    <Card className={`w-full ${compact ? "max-w-sm" : "max-w-md"} p-6 shadow-xl shadow-slate-900/5 sm:p-8`}>
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
          Welcome to Zamtrix
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your business account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-xs font-medium">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.com"
              className="h-10 pl-9"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-medium">Password</Label>
            <button type="button" className="text-[11px] font-medium text-primary hover:underline">
              Forgot?
            </button>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-10 pl-9"
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/5 p-2.5 text-xs text-rose-700 dark:text-rose-400">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="h-10 w-full gap-1.5">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-5 space-y-2">
        <div className="rounded-lg border border-border bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
          <p className="font-medium text-foreground">Demo credentials</p>
          <p className="mt-0.5 font-mono">admin@erp.com · admin123</p>
        </div>
        <p className="text-center text-[11px] text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button type="button" className="font-medium text-primary hover:underline">
            Register business
          </button>
        </p>
        <p className="text-center text-[10px] text-muted-foreground/70">
          Backend: <code className="font-mono">{API_BASE_URL}</code>
        </p>
      </div>
    </Card>
  );
}
