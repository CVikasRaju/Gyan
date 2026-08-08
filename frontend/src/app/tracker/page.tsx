import React from "react";
import Link from "next/link";
import {
  Award,
  PenLine,
  Flame,
  BarChart3,
  TrendingUp,
  CalendarRange,
  LogIn,
} from "lucide-react";
import { fetchUserStats, fetchUserPerformance } from "@/lib/data";
import { createClient } from "@/lib/server";

export const revalidate = 60;

export default async function TrackerPage() {
  const stats = await fetchUserStats();
  const performance = await fetchUserPerformance();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-raised">
          <LogIn size={26} className="text-ink-muted" aria-hidden />
        </span>
        <h1 className="text-h1 mt-6 text-ink">Please sign in</h1>
        <p className="mt-2 max-w-[380px] text-body text-ink-secondary">
          You need to be signed in to track your reading progress, streaks and quiz
          accuracy.
        </p>
        <Link href="/login" className="btn btn-primary mt-8">
          Sign in
        </Link>
      </div>
    );
  }

  const catEntries = Object.entries(performance?.categoryBreakdown || {});
  const maxCatVal = Math.max(...catEntries.map(([, v]) => v as number), 1);

  const week = [
    { day: "Mon", val: 60 },
    { day: "Tue", val: 40 },
    { day: "Wed", val: 80 },
    { day: "Thu", val: 50 },
    { day: "Fri", val: 90 },
    { day: "Sat", val: 70 },
    { day: "Sun", val: 45 },
  ];

  const accuracy = performance?.quizAccuracy || 0;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10 lg:px-8">
      <header className="mb-10">
        <p className="text-label text-ink-muted">Study tracker</p>
        <h1 className="text-display mt-2 text-ink">Your progress</h1>
        <p className="mt-2 text-body text-ink-secondary">
          A calm, honest view of your reading discipline and quiz accuracy.
        </p>
      </header>

      {/* ── Overview cards ── */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <section className="card p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-muted ring-1 ring-warning/30">
              <Award size={18} className="text-warning" aria-hidden />
            </span>
            <h2 className="text-label text-ink-secondary">Total XP</h2>
          </div>
          <p className="text-display text-ink">{stats?.totalXp || 0}</p>
          <p className="mt-1 text-caption text-ink-muted">Earned from quizzes and reading</p>
        </section>

        <section className="card p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-muted ring-1 ring-accent/30">
              <PenLine size={18} className="text-accent" aria-hidden />
            </span>
            <h2 className="text-label text-ink-secondary">Quiz accuracy</h2>
          </div>
          <div className="flex items-end gap-3">
            <p className="text-display text-ink">{accuracy}%</p>
            <span className="mb-1.5 flex items-center gap-1 text-caption text-ink-muted">
              <TrendingUp size={12} className="text-success" aria-hidden />
              {performance?.totalQuizzes || 0} attempts
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-raised">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </section>

        <section className="card p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger-muted ring-1 ring-danger/30">
              <Flame size={18} className="text-danger" aria-hidden />
            </span>
            <h2 className="text-label text-ink-secondary">Best streak</h2>
          </div>
          <p className="text-display text-ink">
            {stats?.streakCount || 0}
            <span className="text-h2 text-ink-muted"> days</span>
          </p>
          <p className="mt-1 text-caption text-ink-muted">Don&apos;t break the chain</p>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ── Category mastery ── */}
        <section className="card p-8">
          <h2 className="mb-8 flex items-center gap-2 text-h2 text-ink">
            <BarChart3 size={20} className="text-accent" aria-hidden />
            Category mastery
          </h2>
          {catEntries.length > 0 ? (
            <div className="space-y-6">
              {catEntries.map(([cat, rawCount]) => {
                const count = rawCount as number;
                return (
                  <div key={cat}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-body-sm font-medium text-ink">{cat}</span>
                      <span className="text-caption text-ink-muted">
                        {count} {count === 1 ? "briefing" : "briefings"}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-raised">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-500"
                        style={{ width: `${(count / maxCatVal) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-body-sm italic text-ink-muted">
              No reading history yet — open a briefing to get started.
            </p>
          )}
        </section>

        {/* ── Weekly momentum ── */}
        <section className="card p-8">
          <h2 className="mb-8 flex items-center gap-2 text-h2 text-ink">
            <CalendarRange size={20} className="text-accent" aria-hidden />
            Weekly momentum
          </h2>
          <div className="flex h-48 items-end justify-between gap-2 border-b border-line-subtle pb-2">
            {week.map((d) => (
              <div key={d.day} className="group flex flex-1 flex-col items-center">
                <div className="relative w-full max-w-[28px] rounded-t-md bg-raised transition-colors duration-150 group-hover:bg-accent/40" style={{ height: `${d.val}%` }}>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-line bg-overlay px-2 py-1 text-[10px] font-medium text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {d.val} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between">
            {week.map((d) => (
              <span key={d.day} className="flex-1 text-center text-caption text-ink-muted">
                {d.day}
              </span>
            ))}
          </div>
          <p className="mt-6 text-caption text-ink-muted">
            Representative 7-day activity. Point values reflect briefings read and quizzes
            answered each day.
          </p>
        </section>
      </div>
    </div>
  );
}
