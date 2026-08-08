import React from "react";
import { fetchUserBookmarks } from "@/lib/data";
import { BookmarksClient } from "@/components/feed/BookmarksClient";

export const revalidate = 60;

export default async function BookmarksPage() {
  const bookmarks = await fetchUserBookmarks();

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10 lg:px-8">
      <header className="mb-8">
        <p className="text-label text-ink-muted">Your reading list</p>
        <h1 className="text-display mt-2 text-ink">Bookmarks</h1>
        <p className="mt-2 text-body text-ink-secondary">
          {bookmarks.length} {bookmarks.length === 1 ? "briefing" : "briefings"} saved for later.
        </p>
      </header>

      <BookmarksClient items={bookmarks} />
    </div>
  );
}
