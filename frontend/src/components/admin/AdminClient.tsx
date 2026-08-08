"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldX,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  Clock3,
} from "lucide-react";
import type { DigestItem } from "@/lib/digests";
import { updateDigestAdminStatus, type AdminStatus } from "@/app/actions";
import { CategoryChip, QaBadge } from "@/components/ui/Badges";
import { useRouter } from "next/navigation";

type Filter = "All" | "Pending Review" | "Flagged" | "Published" | "Quarantined";

const FILTERS: Filter[] = ["All", "Pending Review", "Flagged", "Published", "Quarantined"];

function matchesFilter(status: string | undefined, filter: Filter): boolean {
  switch (filter) {
    case "All":
      return true;
    case "Pending Review":
      return status === "flagged";
    case "Flagged":
      return status === "flagged";
    case "Published":
      return status === "passed";
    case "Quarantined":
      return status === "quarantined";
    default:
      return true;
  }
}

export function AdminClient({ items }: { items: DigestItem[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const filtered = useMemo(
    () => items.filter((i) => matchesFilter(i.qaStatus, filter)),
    [items, filter]
  );

  const selected = items.find((i) => i.id === selectedId) ?? null;

  async function runAction(status: AdminStatus) {
    if (!selected) return;
    setBusy(true);
    setNotice(null);
    const res = await updateDigestAdminStatus(selected.id, status);
    setBusy(false);
    if (res.ok) {
      setNotice(
        status === "passed"
          ? "Approved and published."
          : status === "quarantined"
            ? "Quarantined."
            : "Flagged for review."
      );
      router.refresh();
    } else {
      setNotice(`Action failed: ${res.error}`);
    }
  }

  const pendingCount = items.filter((i) => i.qaStatus === "flagged").length;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
      {/* ── Left: list ── */}
      <section className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
        <div className="border-b border-line-subtle p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-h3 text-ink">Content queue</h2>
            <span
              className={`qa-badge ${pendingCount > 0 ? "qa-flagged" : "qa-passed"}`}
            >
              {pendingCount > 0 ? `${pendingCount} pending` : "All clear"}
            </span>
          </div>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`tab px-3 py-1.5 text-[12px] ${filter === f ? "tab-active" : ""}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <RefreshCw size={20} className="text-ink-muted" aria-hidden />
              <p className="text-body-sm text-ink-muted">
                No items in this view. Great work, editor.
              </p>
            </div>
          ) : (
            <ul>
              {filtered.map((item) => {
                const active = item.id === selected?.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full border-b border-line-subtle px-4 py-4 text-left transition-colors ${
                        active
                          ? "border-l-2 border-l-accent bg-raised"
                          : "border-l-2 border-l-transparent hover:bg-raised/60"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <CategoryChip category={item.category} withIcon={false} />
                        <span className="ml-auto text-caption text-ink-muted">
                          {new Date(item.pubDate).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-body-sm font-medium text-ink line-clamp-1">
                        {item.title}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* ── Right: detail ── */}
      <section className="min-h-[480px] overflow-hidden rounded-xl border border-line bg-surface">
        {selected ? (
          <div className="flex h-full flex-col">
            <div className="border-b border-line-subtle p-6">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <CategoryChip category={selected.category} />
                <QaBadge status={selected.qaStatus} />
                <span className="ml-auto flex items-center gap-1.5 text-caption text-ink-muted">
                  <Clock3 size={12} aria-hidden />
                  {new Date(selected.pubDate).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <h2 className="text-h1 text-ink">{selected.title}</h2>
              <p className="mt-1 text-caption text-ink-muted">via {selected.source}</p>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div>
                <p className="mb-2 text-label text-ink-muted">AI summary</p>
                <p className="text-body leading-relaxed text-ink-secondary">
                  {selected.summary}
                </p>
              </div>

              {/* QA detail */}
              <div className="rounded-lg border border-line bg-canvas/50 p-5">
                <p className="mb-3 text-label text-ink-muted">QA result</p>
                <ul className="space-y-2 text-body-sm text-ink-secondary">
                  <li className="flex items-center justify-between">
                    <span>Factual rating</span>
                    <QaBadge status={selected.qaStatus} />
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Model tier</span>
                    <span className="font-mono text-ink">bulk / flash</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Hallucination check</span>
                    <span className="flex items-center gap-1.5 text-success">
                      <CheckCircle2 size={13} /> run
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-2 text-label text-ink-muted">Source</p>
                <a
                  href={selected.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-body-sm font-medium text-accent hover:text-accent-hover"
                >
                  {selected.source}
                  <ExternalLink size={13} strokeWidth={2} />
                </a>
              </div>

              {/* Version history */}
              <div className="overflow-hidden rounded-lg border border-line">
                <button
                  onClick={() => setShowHistory((v) => !v)}
                  className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-raised"
                >
                  <span className="text-label text-ink-muted">Version history</span>
                  <ChevronDown
                    size={15}
                    className={`text-ink-muted transition-transform ${showHistory ? "rotate-180" : ""}`}
                  />
                </button>
                {showHistory && (
                  <ol className="space-y-3 border-t border-line-subtle px-5 py-4">
                    {[
                      { v: "v3", t: "Editor approved", d: "2h ago" },
                      { v: "v2", t: "AI QA passed", d: "3h ago" },
                      { v: "v1", t: "Created by pipeline", d: "3h ago" },
                    ].map((h) => (
                      <li key={h.v} className="flex items-center justify-between text-body-sm">
                        <span className="flex items-center gap-2 text-ink-secondary">
                          <span className="font-mono text-caption text-ink-muted">{h.v}</span>
                          {h.t}
                        </span>
                        <span className="text-caption text-ink-muted">{h.d}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              {notice && (
                <p className="rounded-lg border border-line bg-canvas/50 px-4 py-3 text-body-sm text-ink-secondary">
                  {notice}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 border-t border-line-subtle p-6">
              <button
                onClick={() => runAction("passed")}
                disabled={busy || selected.qaStatus === "passed"}
                className="btn btn-primary flex-1 min-w-[150px]"
              >
                <CheckCircle2 size={16} strokeWidth={2} />
                Approve & publish
              </button>
              <button
                onClick={() => runAction("flagged")}
                disabled={busy || selected.qaStatus === "flagged"}
                className="btn btn-ghost flex-1 min-w-[120px] border-warning/40 text-warning hover:bg-warning-muted"
              >
                <AlertTriangle size={16} strokeWidth={2} />
                Flag
              </button>
              <button
                onClick={() => runAction("quarantined")}
                disabled={busy || selected.qaStatus === "quarantined"}
                className="btn btn-ghost flex-1 min-w-[120px] border-danger/40 text-danger hover:bg-danger-muted"
              >
                <ShieldX size={16} strokeWidth={2} />
                Quarantine
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-[480px] flex-col items-center justify-center p-10 text-center">
            <ShieldX size={28} className="text-ink-muted" aria-hidden />
            <p className="mt-4 text-body-sm text-ink-muted">
              Select an item from the queue to review it.
            </p>
          </div>
        )}
      </section>

      <div className="col-span-full -mt-2 flex items-center justify-between">
        <p className="text-caption text-ink-muted">
          {items.length} items loaded · changes appear instantly on the public feed
        </p>
        <Link href="/" className="nav-link">
          View public feed
        </Link>
      </div>
    </div>
  );
}
