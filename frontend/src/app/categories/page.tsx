import React from "react";
import Link from "next/link";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { fetchCategoryStats, type CategoryStat } from "@/lib/digests";
import { CATEGORIES, categorySlug } from "@/lib/categories";

export const revalidate = 60;

export default async function CategoriesPage() {
  const stats = await fetchCategoryStats();

  function countFor(name: string): CategoryStat | undefined {
    return stats.find(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );
  }

  const allCount = stats.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10 lg:px-8">
      <header className="mb-10">
        <p className="text-label text-ink-muted">Browse the archive</p>
        <h1 className="text-display mt-2 text-ink">Categories</h1>
        <p className="mt-2 text-body text-ink-secondary">
          {allCount} fact-checked briefings across every beat we cover. Pick a category to
          dive in.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const stat = countFor(cat.name);
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href={`/category/${categorySlug(cat.name)}`}
              className="card card-hover group flex flex-col p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-muted ring-1 ring-accent/30">
                  <Icon size={20} strokeWidth={1.75} className="text-accent" aria-hidden />
                </span>
                <ArrowUpRight
                  size={18}
                  className="text-ink-muted transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  aria-hidden
                />
              </div>
              <h2 className="text-h2 text-ink transition-colors duration-150 group-hover:text-accent">
                {cat.name}
              </h2>
              <p className="mt-2 text-body-sm text-ink-secondary">
                {stat ? (
                  <>
                    <span className="font-semibold text-ink">{stat.count}</span>{" "}
                    {stat.count === 1 ? "briefing" : "briefings"}
                    {stat.latestDate && (
                      <>
                        {" "}· latest{" "}
                        {new Date(stat.latestDate).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </>
                    )}
                  </>
                ) : (
                  "No briefings published yet"
                )}
              </p>
            </Link>
          );
        })}
      </div>

      <section className="mt-12 flex flex-col items-center rounded-xl border border-line bg-surface p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-raised">
          <Newspaper size={20} className="text-ink-secondary" aria-hidden />
        </span>
        <h2 className="text-h2 mt-4 text-ink">Can&apos;t find your topic?</h2>
        <p className="mt-2 max-w-[420px] text-body-sm text-ink-secondary">
          We cover Politics, Economy, Science, World, Technology and Health — plus rotating
          deep dives. Suggest a beat and we&apos;ll consider it for the next release.
        </p>
        <Link href="/" className="btn btn-ghost mt-6">
          Back to today&apos;s digest
        </Link>
      </section>
    </div>
  );
}
