"use client";

import { useEffect } from 'react';
import { trackArticleRead } from '@/app/actions';

export function ReadTracker({ digestId }: { digestId: string }) {
  useEffect(() => {
    // Track as read after 3 seconds of viewing
    const timer = setTimeout(() => {
      trackArticleRead(digestId);
    }, 3000);

    return () => clearTimeout(timer);
  }, [digestId]);

  return null;
}
