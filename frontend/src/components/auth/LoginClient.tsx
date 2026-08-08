"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  ShieldCheck,
  UserRound,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Logo } from "@/components/layout/Logo";

type Mode = "reader" | "admin";

export function LoginClient() {
  const router = useRouter();
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } =
    useAuth();

  const [mode, setMode] = useState<Mode>("reader");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Already signed in → go home
  useEffect(() => {
    if (!loading && user) router.push("/");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="skeleton h-10 w-10 rounded-full" />
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      setBusy(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setBusy(false);
      return;
    }

    const res = isSignUp
      ? await signUpWithEmail(email, password)
      : await signInWithEmail(email, password);

    setBusy(false);
    if (res.error) {
      setError(res.error);
    } else if (isSignUp) {
      setNotice("Account created — check your inbox to confirm your email.");
      setIsSignUp(false);
    }
  }

  async function onForgot() {
    setError(null);
    setNotice(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter your account email first, then request a reset.");
      return;
    }
    setBusy(true);
    const res = await resetPassword(email);
    setBusy(false);
    if (res.error) {
      setError(res.error);
    } else {
      setNotice("Reset link sent — check your inbox.");
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-56px)] items-center justify-center overflow-hidden px-6 py-12">
      {/* Radial glow behind card */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, rgba(79,142,247,0.14), rgba(79,142,247,0.05) 60%, transparent)",
        }}
        aria-hidden
      />

      <div className="relative w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-line bg-surface p-8 shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
          {/* Reader / Admin toggle */}
          <div className="mb-7 flex rounded-full border border-line bg-canvas p-1" role="tablist">
            <button
              role="tab"
              aria-selected={mode === "reader"}
              onClick={() => {
                setMode("reader");
                setError(null);
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-caption font-semibold transition-colors ${
                mode === "reader" ? "bg-accent text-ink-inverse" : "text-ink-secondary hover:text-ink"
              }`}
            >
              <UserRound size={14} strokeWidth={2} />
              Reader
            </button>
            <button
              role="tab"
              aria-selected={mode === "admin"}
              onClick={() => {
                setMode("admin");
                setError(null);
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-caption font-semibold transition-colors ${
                mode === "admin" ? "bg-accent text-ink-inverse" : "text-ink-secondary hover:text-ink"
              }`}
            >
              <ShieldCheck size={14} strokeWidth={2} />
              Admin
            </button>
          </div>

          <h1 className="text-center text-h1 text-ink">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1.5 text-center text-body-sm text-ink-muted">
            {isSignUp
              ? "Start reading fact-checked briefings."
              : mode === "admin"
                ? "Operations team sign in."
                : "Sign in to continue your streak."}
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-caption font-medium text-ink-secondary">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
                  aria-hidden
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`input pl-10 ${error ? "input-error" : ""}`}
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="text-caption font-medium text-ink-secondary">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={onForgot}
                    disabled={busy}
                    className="text-caption font-medium text-accent transition-colors hover:text-accent-hover disabled:opacity-50"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
                  aria-hidden
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`input pl-10 pr-10 ${error ? "input-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition-colors hover:text-ink"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-danger/40 bg-danger-muted px-4 py-3 text-body-sm text-danger">
                {error}
              </p>
            )}
            {notice && (
              <p className="flex items-start gap-2 rounded-lg border border-success/40 bg-success-muted px-4 py-3 text-body-sm text-success">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                {notice}
              </p>
            )}

            <button type="submit" disabled={busy} className="btn btn-primary w-full py-3">
              {busy ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogIn size={16} strokeWidth={2} />
              )}
              {isSignUp ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-caption text-ink-muted">
            <span className="h-px flex-1 bg-line-subtle" />
            or continue with
            <span className="h-px flex-1 bg-line-subtle" />
          </div>

          <button
            onClick={signInWithGoogle}
            disabled={busy}
            className="btn btn-ghost w-full py-3"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-body-sm text-ink-muted">
            {isSignUp ? "Already have an account?" : "New to Gyan?"}{" "}
            <button
              onClick={() => {
                setIsSignUp((v) => !v);
                setError(null);
                setNotice(null);
              }}
              className="font-semibold text-accent transition-colors hover:text-accent-hover"
            >
              {isSignUp ? "Sign in" : "Create one free"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-caption text-ink-muted">
          By continuing you agree to our{" "}
          <Link href="/pricing" className="text-ink-secondary hover:text-accent">
            Terms
          </Link>{" "}
          &{" "}
          <Link href="/pricing" className="text-ink-secondary hover:text-accent">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
