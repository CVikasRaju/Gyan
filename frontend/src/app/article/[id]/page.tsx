import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import { fetchDigestById } from "@/lib/data";
import { fetchRelatedDigests, type DigestItem } from "@/lib/digests";
import { categorySlug } from "@/lib/categories";
import { CategoryChip, QaBadge } from "@/components/ui/Badges";
import { ReadTracker } from "@/components/feed/ReadTracker";
import { ReadingProgress } from "@/components/feed/ReadingProgress";
import { BookmarkButton } from "@/components/feed/BookmarkButton";

export const revalidate = 60;

function estimateReadTime(summary: string): number {
  const words = summary.split(/\s+/).filter(Boolean).length;
  return Math.max(Math.round(words / 200), 2);
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  const article = await fetchDigestById(decodedId);

  if (!article) {
    notFound();
  }

  const related = await fetchRelatedDigests(article.category, decodedId);
  const readTime = estimateReadTime(article.summary);
  const formattedDate = new Date(article.pubDate).toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative">
      <ReadTracker digestId={decodedId} />
      <ReadingProgress />

      <div className="mx-auto max-w-[1200px] px-6 py-8 lg:px-8">
        {/* ── Breadcrumb ── */}
        <nav className="mb-10 flex items-center gap-2 text-caption text-ink-muted" aria-label="Breadcrumb">
          <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-accent">
            <ArrowLeft size={13} strokeWidth={2} />
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link
            href={`/category/${categorySlug(article.category)}`}
            className="transition-colors hover:text-accent"
          >
            {article.category}
          </Link>
          <span aria-hidden>/</span>
          <span className="truncate text-ink-secondary">{article.title}</span>
        </nav>

        {/* ── Article header ── */}
        <header className="mx-auto mb-12 max-w-[720px]">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <CategoryChip category={article.category} />
            <QaBadge status={article.qaStatus} />
            <span className="ml-auto flex items-center">
              <BookmarkButton digestId={decodedId} />
            </span>
          </div>

          <h1 className="text-display leading-tight tracking-tight text-ink">
            {article.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line-subtle pb-6 text-caption text-ink-muted">
            <span className="flex items-center gap-1.5 font-medium text-ink-secondary">
              <ShieldCheck size={13} className="text-success" aria-hidden />
              {article.source}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={13} aria-hidden />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 size={13} aria-hidden />
              {readTime} min read
            </span>
          </div>
        </header>

        {/* ── Article body ── */}
        <div className="mx-auto max-w-[720px]">
          <p
            className="font-serif text-[18px] leading-[1.8] text-ink-secondary first-letter:float-left first-letter:mr-3 first-letter:text-[56px] first-letter:font-bold first-letter:leading-[0.85] first-letter:text-accent"
            style={{ maxWidth: "72ch" }}
          >
            {article.summary}
          </p>

          <div className="my-12 rounded-xl border border-accent/25 bg-accent-muted/50 p-8">
            <h3 className="mb-3 flex items-center gap-2 text-h3 text-ink">
              <Lightbulb size={18} className="text-accent" aria-hidden />
              Key analysis
            </h3>
            <p className="text-body leading-relaxed text-ink-secondary">
              This briefing distils the core implications for current affairs analysis.
              For the full historical context, primary data and expert commentary,
              please refer to the original source below.
            </p>
          </div>
        </div>

        {/* ── Source attribution ── */}
        <footer className="mx-auto mt-14 max-w-[720px] rounded-xl border border-line bg-surface p-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-label text-ink-muted">Original source</p>
              <p className="mt-1 text-h3 text-ink">{article.source}</p>
              <p className="mt-1 text-caption text-ink-muted">
                Based on reporting by {article.source}, {formattedDate}.
              </p>
            </div>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary shrink-0"
            >
              Read original article
              <ArrowUpRight size={16} strokeWidth={2} />
            </a>
          </div>
        </footer>

        {/* ── Related articles ── */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-h1 text-ink">Related briefings</h2>
              <Link
                href={`/category/${categorySlug(article.category)}`}
                className="nav-link"
              >
                View all in {article.category}
                <ArrowUpRight size={14} strokeWidth={2} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((item) => (
                <RelatedCard key={item.id} {...item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function RelatedCard(item: DigestItem) {
  return (
    <Link href={`/article/${item.id}`} className="card card-hover group flex flex-col p-5">
      <div className="mb-3 flex items-center justify-between">
        <CategoryChip category={item.category} />
        <QaBadge status={item.qaStatus} />
      </div>
      <h3 className="text-h3 text-ink transition-colors duration-150 group-hover:text-accent line-clamp-2">
        {item.title}
      </h3>
      <p className="mt-2 text-body-sm text-ink-secondary line-clamp-2">{item.summary}</p>
      <p className="mt-auto pt-4 text-caption text-ink-muted">{item.source}</p>
    </Link>
  );
}
