"use client";

import React from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import {
  BadgeCheck,
  CreditCard,
  LogOut,
  KeyRound,
  Mail,
  Phone,
  UserRound,
  CalendarDays,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function AccountPage() {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="skeleton h-10 w-10 rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-raised">
          <UserRound size={28} className="text-ink-muted" aria-hidden />
        </span>
        <h1 className="text-h1 mt-6 text-ink">Please sign in</h1>
        <p className="mt-2 max-w-[380px] text-body text-ink-secondary">
          You need to be signed in to view your account details and manage your plan.
        </p>
        <Link href="/login" className="btn btn-primary mt-8">
          Go to sign in
        </Link>
      </div>
    );
  }

  const name = user.user_metadata?.full_name || "Not provided";
  const plan = user.user_metadata?.plan || "Basic";
  const joined = new Date(user.created_at).toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const details = [
    { icon: UserRound, label: "Full name", value: name },
    { icon: Mail, label: "Email address", value: user.email || "Not provided" },
    { icon: Phone, label: "Phone number", value: user.phone || "Not provided" },
    { icon: CalendarDays, label: "Member since", value: joined },
  ];

  return (
    <div className="mx-auto max-w-[760px] px-6 py-10">
      <header className="mb-8">
        <p className="text-label text-ink-muted">My account</p>
        <h1 className="text-display mt-2 text-ink">Account settings</h1>
        <p className="mt-2 text-body text-ink-secondary">
          Manage your personal information and subscription plan.
        </p>
      </header>

      <div className="space-y-6">
        {/* Profile summary */}
        <section className="card flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent-muted text-h2 font-bold text-accent ring-1 ring-accent/30">
            {(name[0] || user.email?.[0] || "U").toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="text-h2 text-ink">{name}</p>
            <p className="text-body-sm text-ink-secondary">{user.email}</p>
          </div>
          <span className="chip chip-general sm:ml-auto">Reader</span>
        </section>

        {/* Personal info */}
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line-subtle px-6 py-4">
            <h2 className="text-label text-ink-secondary">Personal information</h2>
            <BadgeCheck size={16} className="text-ink-muted" aria-hidden />
          </div>
          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <p className="mb-1 flex items-center gap-1.5 text-caption font-medium text-ink-muted">
                  <Icon size={12} aria-hidden />
                  {label}
                </p>
                <p className="text-body font-semibold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Subscription */}
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line-subtle px-6 py-4">
            <h2 className="text-label text-ink-secondary">Subscription plan</h2>
            <CreditCard size={16} className="text-ink-muted" aria-hidden />
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent/30 bg-accent-muted/40 p-5">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/20 ring-1 ring-accent/40">
                  <ShieldCheck size={20} className="text-accent" aria-hidden />
                </span>
                <div>
                  <p className="text-h3 text-ink">{plan} plan</p>
                  <p className="text-caption text-ink-muted">Billed monthly · Active</p>
                </div>
              </div>
              <Link href="/pricing" className="btn btn-secondary h-10 px-4 py-0 text-[13px]">
                Upgrade plan
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line-subtle px-6 py-4">
            <h2 className="text-label text-ink-secondary">Security & actions</h2>
            <KeyRound size={16} className="text-ink-muted" aria-hidden />
          </div>
          <div className="space-y-3 p-6">
            <div className="flex items-center justify-between rounded-lg border border-line px-4 py-3.5">
              <div className="flex items-center gap-3">
                <KeyRound size={16} className="text-ink-muted" aria-hidden />
                <span className="text-body font-medium text-ink">Change password</span>
              </div>
              <span className="text-caption text-ink-muted">Use the password reset email</span>
            </div>
            <button
              onClick={() => signOut()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-danger/40 bg-danger-muted px-4 py-3.5 text-body font-semibold text-danger transition-colors hover:bg-danger/20"
            >
              <LogOut size={16} strokeWidth={2} />
              Log out of all devices
            </button>
          </div>
        </section>

        <p className="py-4 text-center text-caption text-ink-muted">
          Gyan · Privacy Policy · Terms of Service
        </p>
      </div>
    </div>
  );
}
