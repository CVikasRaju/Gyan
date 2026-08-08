import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 group shrink-0" aria-label="Gyan home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent/15 ring-1 ring-accent/40 transition-all duration-150 group-hover:bg-accent/25 group-hover:ring-accent/70">
        <ShieldCheck size={18} strokeWidth={1.75} className="text-accent" aria-hidden />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[17px] font-bold tracking-tight text-ink">Gyan</span>
          <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Fact-checked daily
          </span>
        </span>
      )}
    </Link>
  );
}
