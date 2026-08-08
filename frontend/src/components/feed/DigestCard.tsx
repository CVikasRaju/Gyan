"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { DigestItem } from "@/lib/digests";
import { CategoryChip, QaBadge } from "@/components/ui/Badges";
import { BookmarkButton } from "@/components/feed/BookmarkButton";

export function DigestCard({ item }: { item: DigestItem }) {
  const date = new Date(item.pubDate);
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <article className="card card-hover group flex flex-col p-6">
      {/* Top metadata row */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <CategoryChip category={item.category} />
        <span className="text-caption text-ink-muted whitespace-nowrap pt-0.5">{time}</span>
      </div>

      {/* Title */}
      <Link href={`/article/${item.id}`} className="mb-2">
        <h3 className="text-h2 text-ink transition-colors duration-150 group-hover:text-accent line-clamp-2">
          {item.title}
        </h3>
      </Link>

      {/* Summary */}
      <p className="mb-5 text-body text-ink-secondary line-clamp-3">{item.summary}</p>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line-subtle pt-4">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex min-w-0 items-center gap-1.5 text-caption text-ink-muted transition-colors hover:text-accent"
        >
          <span className="truncate font-medium">{item.source}</span>
          <ArrowUpRight size={12} strokeWidth={2} className="shrink-0" aria-hidden />
        </a>
        <div className="flex shrink-0 items-center gap-2">
          <QaBadge status={item.qaStatus} />
          <BookmarkButton digestId={item.id} />
        </div>
      </div>
    </article>
  );
}
