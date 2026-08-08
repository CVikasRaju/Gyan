"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, BookmarkX, Loader2 } from "lucide-react";
import type { DigestItem } from "@/lib/digests";
import { removeBookmark } from "@/lib/bookmarks";
import { CategoryChip, QaBadge } from "@/components/ui/Badges";

export function BookmarksClient({ items }: { items: DigestItem[] }) {
  const router = useRouter();
  const [list, setList] = useState(items);
  const [removing, setRemoving] = useState<string | null>(null);

  async function onRemove(id: string) {
    setRemoving(id);
    try {
      await removeBookmark(id);
      setList((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    } finally {
      setRemoving(null);
    }
  }

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-raised">
          <BookmarkX size={28} className="text-ink-muted" aria-hidden />
        </span>
        <h2 className="text-h2 mt-6 text-ink">No saved briefings</h2>
        <p className="mt-2 max-w-[320px] text-body-sm text-ink-secondary">
          Tap the bookmark icon on any briefing to keep it here for offline reading.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          Browse today&apos;s digest
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {list.map((item) => (
        <article key={item.id} className="card card-hover group relative flex flex-col p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <CategoryChip category={item.category} />
            <QaBadge status={item.qaStatus} />
          </div>

          <Link href={`/article/${item.id}`} className="mb-2">
            <h3 className="text-h2 text-ink transition-colors duration-150 group-hover:text-accent line-clamp-2">
              {item.title}
            </h3>
          </Link>
          <p className="mb-5 text-body text-ink-secondary line-clamp-3">{item.summary}</p>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-line-subtle pt-4">
            <span className="text-caption text-ink-muted">
              {new Date(item.pubDate).toLocaleDateString([], {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <div className="flex items-center gap-3">
              <Link
                href={`/article/${item.id}`}
                className="flex items-center gap-1 text-caption font-semibold text-accent transition-colors hover:text-accent-hover"
              >
                Read
                <ArrowUpRight size={12} strokeWidth={2} />
              </Link>
              <button
                onClick={() => onRemove(item.id)}
                disabled={removing === item.id}
                className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-danger-muted hover:text-danger disabled:opacity-50"
                aria-label="Remove bookmark"
              >
                {removing === item.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <BookmarkX size={14} strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
