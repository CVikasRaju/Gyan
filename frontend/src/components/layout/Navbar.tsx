"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  X,
  LayoutGrid,
  Globe,
  Bookmark,
  HelpCircle,
  LogOut,
  UserRound,
  ShieldCheck,
  PenLine,
  Sun,
  Moon,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useAuth } from "@/components/auth/AuthProvider";
import { useTheme } from "@/components/theme/ThemeProvider";

const NAV_LINKS = [
  { label: "Dashboard", href: "/", icon: LayoutGrid },
  { label: "Categories", href: "/categories", icon: Globe },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { label: "Quiz", href: "/quiz", icon: PenLine },
];

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Digest is ready",
    body: "Today's fact-checked briefing has been published.",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Quiz available",
    body: "5 new questions from today's top stories.",
    time: "1h ago",
    unread: true,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const isAdmin =
    user?.user_metadata?.role === "admin" || user?.email?.endsWith("@gyan.ai");

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials = (user?.user_metadata?.full_name || user?.email || "U")
    .split(" ")
    .map((p: string) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <header className="glass sticky top-0 z-100 h-14 border-b border-line-subtle">
        <div className="mx-auto flex h-full max-w-[1200px] items-center gap-6 px-6 lg:px-8">
          {/* Left: logo */}
          <Logo />

          {/* Center: links (desktop) */}
          <nav className="hidden h-full items-center gap-7 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${active ? "nav-link-active" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="ml-auto flex items-center gap-1.5">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-raised hover:text-ink"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? (
                <Sun size={18} strokeWidth={1.75} />
              ) : (
                <Moon size={18} strokeWidth={1.75} />
              )}
            </button>

            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-raised hover:text-ink"
              aria-label="Search briefings"
            >
              <Search size={18} strokeWidth={1.75} />
            </Link>

            {/* Notifications */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setBellOpen((v) => !v)}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-raised hover:text-ink"
                aria-label="Notifications"
              >
                <Bell size={18} strokeWidth={1.75} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent ring-2 ring-canvas" />
              </button>

              {bellOpen && (
                <div className="absolute right-0 top-11 w-[340px] overflow-hidden rounded-xl border border-line bg-overlay shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                  <div className="flex items-center justify-between border-b border-line-subtle px-4 py-3">
                    <p className="text-h3 text-ink">Notifications</p>
                    <span className="chip chip-general">2 new</span>
                  </div>
                  <ul>
                    {NOTIFICATIONS.map((n) => (
                      <li
                        key={n.id}
                        className="flex gap-3 border-b border-line-subtle px-4 py-3 last:border-0 hover:bg-raised transition-colors"
                      >
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                        <div className="min-w-0">
                          <p className="text-body-sm font-semibold text-ink">{n.title}</p>
                          <p className="text-body-sm text-ink-secondary">{n.body}</p>
                          <p className="mt-0.5 text-caption text-ink-muted">{n.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Auth */}
            {loading ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-raised" />
            ) : user ? (
              <Link
                href="/account"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted text-caption font-bold text-accent ring-1 ring-accent/30 transition-all hover:ring-accent/70"
                aria-label="My account"
              >
                {initials || <UserRound size={16} />}
              </Link>
            ) : (
              <Link
                href="/login"
                className="btn btn-primary h-9 px-4 py-0 text-[13px]"
              >
                Sign in
              </Link>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-raised hover:text-ink md:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-100 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[300px] flex-col border-l border-line bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-line-subtle px-5 py-4">
              <Logo />
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary hover:bg-raised hover:text-ink"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              {NAV_LINKS.map((link) => {
                const active =
                  link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-body transition-colors ${
                      active
                        ? "bg-accent-muted text-ink"
                        : "text-ink-secondary hover:bg-raised hover:text-ink"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.75} />
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/pricing"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-body text-ink-secondary transition-colors hover:bg-raised hover:text-ink"
              >
                <ShieldCheck size={18} strokeWidth={1.75} />
                Pricing
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-body text-warning transition-colors hover:bg-warning-muted"
                >
                  <ShieldCheck size={18} strokeWidth={1.75} />
                  Editorial Dashboard
                </Link>
              )}
              <Link
                href="/account"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-body text-ink-secondary transition-colors hover:bg-raised hover:text-ink"
              >
                <UserRound size={18} strokeWidth={1.75} />
                Account
              </Link>
              <Link
                href="/help"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-body text-ink-secondary transition-colors hover:bg-raised hover:text-ink"
              >
                <HelpCircle size={18} strokeWidth={1.75} />
                Help Center
              </Link>
            </nav>

            {user ? (
              <div className="border-t border-line-subtle p-4">
                <p className="mb-3 truncate px-2 text-body-sm text-ink-secondary">
                  Signed in as <span className="font-semibold text-ink">{user.email}</span>
                </p>
                <button
                  onClick={() => {
                    signOut?.();
                    setDrawerOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-line px-4 py-3 text-body font-medium text-ink-secondary transition-colors hover:bg-danger-muted hover:text-danger"
                >
                  <LogOut size={16} strokeWidth={1.75} />
                  Log out
                </button>
              </div>
            ) : (
              <div className="border-t border-line-subtle p-4">
                <Link href="/login" onClick={() => setDrawerOpen(false)} className="btn btn-primary w-full">
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
