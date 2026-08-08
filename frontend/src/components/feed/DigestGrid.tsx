"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { DigestItem } from "@/lib/digests";
import { DigestCard } from "@/components/feed/DigestCard";

export function DigestGrid({
  items,
  initial = 9,
  step = 6,
  columns = "3",
}: {
  items: DigestItem[];
  initial?: number;
  step?: number;
  columns?: "2" | "3";
}) {
  const [visible, setVisible] = useState(Math.min(initial, items.length));
  const shown = items.slice(0, visible);
  const remaining = items.length - visible;

  return (
    <>
      <div
        className={
          columns === "3"
            ? "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            : "grid grid-cols-1 gap-6 md:grid-cols-2"
        }
      >
        {shown.map((item) => (
          <DigestCard key={item.id} item={item} />
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            onClick={() => setVisible((v) => Math.min(v + step, items.length))}
            className="btn btn-ghost min-w-[180px]"
          >
            <ChevronDown size={16} strokeWidth={2} />
            Load more ({remaining})
          </button>
        </div>
      )}
    </>
  );
}
