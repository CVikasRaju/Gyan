"use client";

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { addBookmark, removeBookmark, getBookmarks } from '@/lib/bookmarks';

export function BookmarkButton({ digestId }: { digestId: string }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if already bookmarked on mount
  useEffect(() => {
    if (!user) return;
    const fetchStatus = async () => {
      const list = await getBookmarks();
      setSaved(list.some(b => b.id === digestId));
    };
    fetchStatus();
  }, [user, digestId]);

  const toggle = async () => {
    if (!user) return; // optionally trigger login
    setLoading(true);
    if (saved) {
      await removeBookmark(digestId);
    } else {
      await addBookmark(digestId);
    }
    setSaved(!saved);
    setLoading(false);
  };

  return (
    <button
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(); }}
      disabled={loading}
      className="text-outline hover:text-primary transition-colors p-1 -mr-1 -mt-1 rounded-full hover:bg-surface-container disabled:opacity-50"
    >
      <span 
        className="material-symbols-outlined text-[20px]" 
        style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}
      >
        bookmark
      </span>
    </button>
  );
}
