import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ShieldCheck,
  Flame,
  Target,
  PenLine,
  CheckCircle2,
  Sparkles,
  SearchX,
} from "lucide-react";
import { fetchDigests } from "@/lib/digests";
import { fetchUserStats } from "@/lib/data";
import { CATEGORIES, categorySlug } from "@/lib/categories";
import { CategoryChip, QaBadge } from "@/components/ui/Badges";
import { SearchBar } from "@/components/feed/SearchBar";
import { DigestGrid } from "@/components/feed/DigestGrid";

export const revalidate = 60;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const items = await fetchDigests({ q, limit: 30 });
  const userStats = await fetchUserStats();

  const featured = items[0] ?? null;
  const rest = items.slice(1);

  const today = new Date();
  const updatedLabel = today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Goal progress
  const articlesRead = userStats?.articlesReadToday || 0;
  const dailyGoal = userStats?.dailyGoal || 5;
  const goalPercent = Math.min(Math.round((articlesRead / dailyGoal) * 100), 100);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10 lg:px-8">
      {/* ── Hero strip ── */}
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
          </span>
          <p className="text-label text-success">Live · Updated {updatedLabel}</p>
        </div>
        <h1 className="text-display mt-2 text-ink">
          Today&apos;s Digest —{" "}
          <span className="text-ink-secondary">
            {today.toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </h1>
        <p className="mt-2 text-body text-ink-secondary">
          {items.length} fact-checked briefings · AI-summarised, human-verified, source-attributed.
        </p>
      </header>

      {/* ── Search ── */}
      <div className="mb-6">
        <SearchBar defaultValue={q} />
      </div>

      {/* ── Sticky filter tabs ── */}
      <div className="sticky top-14 z-30 -mx-6 mb-8 border-b border-line-subtle bg-canvas/95 px-6 backdrop-blur-md lg:-mx-8 lg:px-8">
        <div className="no-scrollbar flex gap-2 overflow-x-auto py-3">
          <Link href="/" className={`tab ${!q ? "tab-active" : ""}`}>
            All
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/category/${categorySlug(cat.name)}`}
              className="tab"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Layout: feed + widgets ── */}
      <div className="flex gap-8">
        <div className="min-w-0 flex-1">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <SearchXIcon />
              <h2 className="text-h2 mt-5 text-ink">No briefings found</h2>
              <p className="mt-2 max-w-[320px] text-body-sm text-ink-secondary">
                Try a different search term, or check back after the next pipeline run.
              </p>
              {q && (
                <Link href="/" className="btn btn-ghost mt-6">
                  Clear search
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Featured card */}
              {featured && (
                <Link
                  href={`/article/${featured.id}`}
                  className="card card-hover group relative mb-8 block overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
                  <div className="flex flex-col gap-8 p-8 lg:flex-row lg:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="mb-4 flex items-center gap-3">
                        <CategoryChip category={featured.category} />
                        <QaBadge status={featured.qaStatus} />
                      </div>
                      <h2 className="text-h1 text-ink transition-colors duration-150 group-hover:text-accent">
                        {featured.title}
                      </h2>
                      <p className="mt-3 max-w-[64ch] text-body-lg text-ink-secondary line-clamp-3">
                        {featured.summary}
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-5 text-caption text-ink-muted">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck size={13} className="text-success" />
                          Fact-checked
                        </span>
                        <span>
                          {new Date(featured.pubDate).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          Based on {featured.source}
                          <ArrowUpRight size={12} className="text-accent" />
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 self-start lg:self-center">
                      <span className="btn btn-primary pointer-events-none">
                        Read briefing
                        <ArrowUpRight size={16} strokeWidth={2} />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Rest of the feed */}
              {rest.length > 0 && <DigestGrid items={rest} initial={6} />}
            </>
          )}
        </div>

        {/* ── Right widgets ── */}
        <aside className="hidden w-[300px] shrink-0 flex-col gap-6 xl:flex">
          {/* Daily goal */}
          <section className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-label text-ink-secondary">Daily goal</h3>
              <Target size={16} className="text-ink-muted" aria-hidden />
            </div>
            <div className="mb-3 flex items-end gap-2">
              <span className="text-display text-ink">{articlesRead}</span>
              <span className="mb-1.5 text-caption text-ink-muted">/ {dailyGoal} briefings</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-raised">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
            <p className="mt-3 text-caption text-ink-muted">
              {goalPercent >= 100
                ? "Goal reached — excellent discipline."
                : `${Math.max(dailyGoal - articlesRead, 0)} more to hit today's goal.`}
            </p>
          </section>

          {/* Streak */}
          <section className="relative overflow-hidden rounded-xl border border-line bg-gradient-to-br from-accent-muted via-surface to-surface p-6">
            <Sparkles
              size={110}
              strokeWidth={1}
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 text-accent/10"
            />
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 ring-1 ring-accent/40">
                <Flame size={18} className="text-accent" aria-hidden />
              </span>
              <h3 className="text-label text-ink-secondary">Current streak</h3>
            </div>
            <p className="mt-4 text-display text-ink">{userStats?.streakCount || 0} days</p>
            <p className="mt-1 text-body-sm text-ink-secondary">
              Consistent reading builds deep knowledge. Don&apos;t break the chain.
            </p>
          </section>

          {/* Quiz */}
          <section className="card flex flex-col items-center p-6 text-center">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-muted ring-1 ring-accent/30">
              <PenLine size={20} className="text-accent" aria-hidden />
            </span>
            <h3 className="text-h3 text-ink">Daily quiz</h3>
            <p className="mb-5 mt-1.5 text-body-sm text-ink-secondary">
              Reinforce what you read with 5 questions generated from today&apos;s briefings.
            </p>
            <Link href="/quiz" className="btn btn-primary w-full">
              Start quick quiz
            </Link>
          </section>

          {/* Trust */}
          <section className="rounded-xl border border-success/25 bg-success-muted p-5">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-success" aria-hidden />
              <h3 className="text-label text-success">Why trust Gyan?</h3>
            </div>
            <p className="text-body-sm text-ink-secondary">
              Every summary is cross-checked against its source by AI and reviewed by editors
              before it reaches your feed. Ad-free, always.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function SearchXIcon() {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-raised">
      <SearchX size={24} className="text-ink-muted" aria-hidden />
    </span>
  );
}
