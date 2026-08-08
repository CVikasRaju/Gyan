import React from "react";
import Link from "next/link";
import { ShieldX, AlertTriangle } from "lucide-react";
import { fetchFlaggedDigests } from "@/lib/data";
import { fetchDigests } from "@/lib/digests";
import { createClient } from "@/lib/server";
import { AdminClient } from "@/components/admin/AdminClient";

export const revalidate = 30;

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isAdmin = user?.user_metadata?.role === "admin" || user?.email?.endsWith("@gyan.ai");

  if (!isAdmin) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-muted">
          <ShieldX size={28} className="text-danger" aria-hidden />
        </span>
        <h1 className="text-h1 mt-6 text-ink">Access denied</h1>
        <p className="mt-2 max-w-[380px] text-body text-ink-secondary">
          The editorial dashboard is restricted to the Gyan operations team. You don&apos;t have
          the required permissions.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          Return to dashboard
        </Link>
      </div>
    );
  }

  const [flagged, all] = await Promise.all([
    fetchFlaggedDigests(),
    fetchDigests({ limit: 100 }),
  ]);

  // Merge both sources, de-duplicate by id
  const byId = new Map<string, (typeof all)[number]>();
  [...all, ...flagged].forEach((item) => byId.set(item.id, item));
  const items = Array.from(byId.values());

  const pendingCount = items.filter((i) => i.qaStatus === "flagged").length;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10 lg:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-label text-ink-muted">Internal · Operations</p>
          <h1 className="text-display mt-2 text-ink">Editorial dashboard</h1>
          <p className="mt-2 text-body text-ink-secondary">
            Review AI-generated summaries against their sources before they reach readers.
          </p>
        </div>
        <div
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-caption font-semibold ${
            pendingCount > 0
              ? "border-warning/40 bg-warning-muted text-warning"
              : "border-success/40 bg-success-muted text-success"
          }`}
        >
          {pendingCount > 0 ? (
            <AlertTriangle size={14} aria-hidden />
          ) : (
            <ShieldX size={14} aria-hidden />
          )}
          {pendingCount > 0
            ? `${pendingCount} item${pendingCount === 1 ? "" : "s"} pending review`
            : "Queue clear"}
        </div>
      </header>

      <AdminClient items={items} />
    </div>
  );
}
