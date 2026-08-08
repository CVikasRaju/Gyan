"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchBar({ defaultValue = "", placeholder = "Search briefings, topics, sources..." }: {
  defaultValue?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);

  // Cmd/Ctrl+K focuses the search field
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
  }

  return (
    <form onSubmit={onSubmit} role="search" className="relative">
      <Search
        size={20}
        strokeWidth={1.75}
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="input h-11 pl-11 pr-16"
        aria-label="Search briefings"
      />
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={() => {
              setValue("");
              if (defaultValue) router.push(pathname);
            }}
            className="flex h-6 w-6 items-center justify-center rounded text-ink-muted transition-colors hover:bg-raised hover:text-ink"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="hidden rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-[10px] text-ink-muted sm:block">
            ⌘K
          </kbd>
        )}
      </div>
    </form>
  );
}
