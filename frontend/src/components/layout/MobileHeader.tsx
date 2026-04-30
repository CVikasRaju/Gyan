"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

export function MobileHeader({ openDrawer }: { openDrawer: () => void }) {
  const { user } = useAuth();

  return (
    <header className="md:hidden sticky top-0 z-30 flex justify-between items-center w-full px-6 h-16 bg-surface-bright border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <button
        onClick={openDrawer}
        className="text-primary p-2 -ml-2 rounded-full hover:bg-surface-container transition-colors"
        aria-label="Open navigation menu"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <h1 className="font-h2 text-primary font-black">Gyan</h1>

      <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-surface-container flex items-center justify-center">
        {user ? (
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>
            person
          </span>
        ) : (
          <Link href="/login">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">login</span>
          </Link>
        )}
      </div>
    </header>
  );
}
