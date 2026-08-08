import React from "react";
import Link from "next/link";
import { X, SlidersHorizontal } from "lucide-react";
import { fetchDigests } from "@/lib/digests";
import { CATEGORIES, categorySlug, categoryChipClass } from "@/lib/categories";
import { SearchBar } from "@/components/feed/SearchBar";
import { DigestGrid } from "@/components/feed/DigestGrid";

export const revalidate = 60;

const DATE_RANGES = [
  { label: "All time", value: 0 },
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
];

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ q?: string; days?: string }>;
}) {
  const { category } = await params;
  const decoded = decodeURIComponent(category).replace(/-/g, " ");
  // Best-effort reverse slug → readable name (matches canonical list case-insensitively)
  const canonical = CATEGORIES.find(
    (c) => categorySlug(c.name) === decoded.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  );
  const displayName = canonical?.name || decoded.replace(/\b\w/g, (m) => m.toUpperCase());

  const { q, days } = await searchParams;
  const daysNum = days ? parseInt(days, 10) : 0;

  const items = await fetchDigests({ category: canonical?.name ?? decoded, q, days: daysNum || undefined });

  const hasFilters = Boolean(q) || daysNum > 0;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10 lg:px-8">
      {/* ── Header ── */}
      <header className="mb-8">
        <p className="text-label text-ink-muted">Category briefing</p>
        <div className="mt-2 flex items-center gap-4">
          <h1 className="text-display text-ink">{displayName}</h1>
          <span className={`chip ${categoryChipClass(displayName)}`}>
            {items.length} {items.length === 1 ? "briefing" : "briefings"}
          </span>
        </div>
      </header>

      {/* ── Search + date filter ── */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <SearchBar defaultValue={q} placeholder={`Search within ${displayName}...`} />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-ink-muted" aria-hidden />
          {DATE_RANGES.map((range) => {
            const active = daysNum === range.value;
            const href =
              range.value === 0
                ? `/category/${category}${q ? `?q=${encodeURIComponent(q)}` : ""}`
                : `/category/${category}?days=${range.value}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
            return (
              <Link
                key={range.value}
                href={href}
                className={`tab px-3.5 py-1.5 text-[12px] ${active ? "tab-active" : ""}`}
              >
                {range.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Sticky category tabs ── */}
      <div className="sticky top-14 z-30 -mx-6 mb-8 border-b border-line-subtle bg-canvas/95 px-6 backdrop-blur-md lg:-mx-8 lg:px-8">
        <div className="no-scrollbar flex gap-2 overflow-x-auto py-3">
          <Link href="/" className="tab">
            All
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/category/${categorySlug(cat.name)}`}
              className={`tab ${canonical?.name === cat.name ? "tab-active" : ""}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Active filter chips ── */}
      {hasFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {canonical && (
            <span className="flex items-center gap-2 rounded-full border border-line bg-raised px-3 py-1.5 text-body-sm text-ink">
              {displayName}
              <Link href={`/category/${categorySlug(displayName)}`} aria-label={`Remove ${displayName} filter`}>
                <X size={13} className="text-ink-muted hover:text-ink" />
              </Link>
            </span>
          )}
          {daysNum > 0 && (
            <span className="flex items-center gap-2 rounded-full border border-line bg-raised px-3 py-1.5 text-body-sm text-ink">
              Last {daysNum} days
              <Link href={`/category/${category}${q ? `?q=${encodeURIComponent(q)}` : ""}`} aria-label="Remove date filter">
                <X size={13} className="text-ink-muted hover:text-ink" />
              </Link>
            </span>
          )}
          {q && (
            <span className="flex items-center gap-2 rounded-full border border-line bg-raised px-3 py-1.5 text-body-sm text-ink">
              “{q}”
              <Link href={`/category/${category}${daysNum > 0 ? `?days=${daysNum}` : ""}`} aria-label="Remove search filter">
                <X size={13} className="text-ink-muted hover:text-ink" />
              </Link>
            </span>
          )}
          <Link href={`/category/${category}`} className="text-caption font-medium text-accent hover:underline">
            Clear all
          </Link>
        </div>
      )}

      {/* ── Grid ── */}
      {items.length > 0 ? (
        <DigestGrid items={items} />
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-raised text-ink-muted">
            <SlidersHorizontal size={22} />
          </span>
          <h2 className="text-h2 mt-5 text-ink">Nothing here yet</h2>
          <p className="mt-2 max-w-[320px] text-body-sm text-ink-secondary">
            No briefings match this filter in {displayName}. Try widening the date range
            or clearing the search.
          </p>
          <Link href={`/category/${category}`} className="btn btn-ghost mt-6">
            Clear filters
          </Link>
        </div>
      )}
    </div>
  );
}
