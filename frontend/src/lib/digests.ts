import { createClient } from "@/lib/server";

export type DigestItem = {
  id: string;
  title: string;
  summary: string;
  link: string;
  source: string;
  category: string;
  pubDate: string;
  qaStatus: "passed" | "flagged" | "quarantined";
};

type DigestRow = {
  id: string;
  title?: string | null;
  summary_text?: string | null;
  source_url?: string | null;
  source_name?: string | null;
  subject_category?: string | null;
  original_published_at?: string | null;
  created_at?: string | null;
  factual_rating?: string | null;
};

function mapRow(row: DigestRow): DigestItem {
  return {
    id: row.id,
    title: row.title || "Unknown Headline",
    summary: row.summary_text || "No summary available.",
    link: row.source_url || "#",
    source: row.source_name || "Verified Publisher",
    category: row.subject_category || "General",
    pubDate: row.original_published_at || row.created_at || new Date().toISOString(),
    qaStatus: (row.factual_rating || "passed") as DigestItem["qaStatus"],
  };
}

export async function fetchDigests(opts: {
  category?: string;
  q?: string;
  days?: number;
  limit?: number;
} = {}): Promise<DigestItem[]> {
  const supabase = await createClient();
  let query = supabase.from("digests").select("*");

  if (opts.category) {
    query = query.eq("subject_category", opts.category);
  }

  if (opts.q) {
    query = query.or(`title.ilike.%${opts.q}%,summary_text.ilike.%${opts.q}%`);
  }

  if (opts.days && opts.days > 0) {
    const since = new Date();
    since.setDate(since.getDate() - opts.days);
    query = query.gte("original_published_at", since.toISOString());
  }

  const { data, error } = await query
    .order("original_published_at", { ascending: false })
    .limit(opts.limit ?? 30);

  if (error || !data) {
    console.error("Supabase fetch query error:", error);
    return [];
  }

  return data.map((row) => mapRow(row as DigestRow));
}

/** Related digests in the same category, excluding the current article. */
export async function fetchRelatedDigests(
  category: string,
  excludeId: string,
  limit = 3
): Promise<DigestItem[]> {
  if (!category) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("digests")
    .select("*")
    .eq("subject_category", category)
    .neq("id", excludeId)
    .order("original_published_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map((row) => mapRow(row as DigestRow));
}

export type CategoryStat = {
  name: string;
  count: number;
  latestDate: string | null;
};

/** Counts of recent digests grouped by category (for the categories index). */
export async function fetchCategoryStats(): Promise<CategoryStat[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("digests")
    .select("subject_category, original_published_at")
    .order("original_published_at", { ascending: false })
    .limit(500);

  if (error || !data) return [];

  const byCategory = new Map<string, { count: number; latestDate: string | null }>();
  for (const row of data) {
    const name = row.subject_category || "General";
    const entry = byCategory.get(name) || { count: 0, latestDate: null };
    entry.count += 1;
    if (!entry.latestDate && row.original_published_at) {
      entry.latestDate = row.original_published_at;
    }
    byCategory.set(name, entry);
  }

  return Array.from(byCategory.entries())
    .map(([name, { count, latestDate }]) => ({ name, count, latestDate }))
    .sort((a, b) => b.count - a.count);
}
