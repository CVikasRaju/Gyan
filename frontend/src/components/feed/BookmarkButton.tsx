"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { addBookmark, removeBookmark, getBookmarks } from "@/lib/bookmarks";
import { useRouter } from "next/navigation";

export function BookmarkButton({ digestId }: { digestId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if already bookmarked on mount
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const fetchStatus = async () => {
      const list = await getBookmarks();
      if (!cancelled) setSaved(list.some((b) => b.id === digestId));
    };
    fetchStatus();
    return () => {
      cancelled = true;
    };
  }, [user, digestId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      if (saved) {
        await removeBookmark(digestId);
      } else {
        await addBookmark(digestId);
      }
      setSaved(!saved);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? "Remove bookmark" : "Save bookmark"}
      aria-pressed={saved}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
        saved
          ? "text-accent"
          : "text-ink-muted hover:bg-raised hover:text-ink-secondary"
      } disabled:opacity-50`}
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : saved ? (
        <BookmarkCheck size={15} strokeWidth={1.75} />
      ) : (
        <Bookmark size={15} strokeWidth={1.75} />
      )}
    </button>
  );
}
