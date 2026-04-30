"use client";

import React from 'react';
import type { DigestItem } from '@/lib/data';
import Link from 'next/link';
import { BookmarkButton } from '@/components/feed/BookmarkButton';

export function DigestCard({ item }: { item: DigestItem }) {
  const formattedTime = new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <article className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 flex flex-col gap-4 group cursor-pointer hover:shadow-md transition-shadow">
      {/* Top row: category + bookmark */}
      <div className="flex justify-between items-start">
        <span className="text-secondary font-label-sm uppercase tracking-wider">
          {item.source || 'News'}
        </span>
        <BookmarkButton digestId={item.id} />
      </div>

      {/* Title */}
      <h4 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors line-clamp-2">
        {item.title}
      </h4>

      {/* Summary */}
      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 flex-1">
        {item.summary}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-variant">
        <span className="font-label-sm text-on-surface-variant">{formattedTime} • Deep Dive</span>
        <Link
          href={`/article/${item.id}`}
          className="font-label-md text-secondary hover:text-on-secondary-container transition-colors flex items-center gap-1"
        >
          Read Full
          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </Link>
      </div>
    </article>
  );
}
