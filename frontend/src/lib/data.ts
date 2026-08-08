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

export type UserStats = {
  streakCount: number;
  totalXp: number;
  dailyGoal: number;
  articlesReadToday: number;
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

function mapDigestRow(row: DigestRow): DigestItem {
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

export async function fetchDigestById(id: string): Promise<DigestItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("digests").select("*").eq("id", id).single();
  if (error || !data) {
    console.error(`Error fetching digest ${id}:`, error);
    return null;
  }
  return mapDigestRow(data as DigestRow);
}

export async function fetchUserBookmarks(): Promise<DigestItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*, digests(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching user bookmarks:", error);
    return [];
  }

  return data.map((row) => mapDigestRow(row.digests as DigestRow));
}

export async function fetchUserStats(): Promise<UserStats | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Fetch basic stats
  const { data: initial, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", user.id)
    .single();

  let stats = initial;

  if (error && error.code === "PGRST116") {
    // Stats don't exist, initialize them
    const { data: newStats, error: initError } = await supabase
      .from("user_stats")
      .insert([{ user_id: user.id, streak_count: 0, total_xp: 0, daily_goal_num: 5 }])
      .select()
      .single();

    if (initError) {
      console.error("Error initializing user stats:", initError);
      return null;
    }
    stats = newStats;
  } else if (error) {
    console.error("Error fetching user stats:", error);
    return null;
  }

  // 2. Fetch today's read count
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error: countError } = await supabase
    .from("read_articles")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("read_at", today.toISOString());

  if (countError) {
    console.error("Error fetching today read count:", countError);
  }

  return {
    streakCount: stats?.streak_count || 0,
    totalXp: stats?.total_xp || 0,
    dailyGoal: stats?.daily_goal_num || 5,
    articlesReadToday: count || 0,
  };
}

export type QuizRow = {
  id: string;
  question: string;
  options: string[];
  correct_option_index: number;
  explanation?: string | null;
  difficulty?: string | null;
  created_at?: string;
};

export async function fetchDailyQuizzes(): Promise<QuizRow[]> {
  const supabase = await createClient();
  // Fetch quizzes created in the last 24 hours
  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);

  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .gte("created_at", yesterday.toISOString())
    .limit(5);

  if (error || !data) {
    console.error("Error fetching quizzes:", error);
    return [];
  }

  return data as QuizRow[];
}

export type PerformanceData = {
  categoryBreakdown: Record<string, number>;
  quizAccuracy: number;
  totalQuizzes: number;
};

export async function fetchUserPerformance(): Promise<PerformanceData | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Fetch category breakdown from read articles
  const { data: readData } = await supabase
    .from("read_articles")
    .select("digests(subject_category)")
    .eq("user_id", user.id);

  const categories: Record<string, number> = {};
  readData?.forEach((row) => {
    // PostgREST may embed the digest as an object (to-one) or an array — handle both.
    const embedded = (row as { digests?: unknown }).digests;
    const digest = Array.isArray(embedded) ? embedded[0] : embedded;
    const cat =
      (digest as { subject_category?: string } | undefined)?.subject_category || "General";
    categories[cat] = (categories[cat] || 0) + 1;
  });

  // 2. Fetch quiz performance
  const { data: quizData } = await supabase
    .from("quiz_attempts")
    .select("is_correct")
    .eq("user_id", user.id);

  const totalQuizzes = quizData?.length || 0;
  const correctQuizzes = quizData?.filter((q) => q.is_correct).length || 0;

  return {
    categoryBreakdown: categories,
    quizAccuracy: totalQuizzes > 0 ? Math.round((correctQuizzes / totalQuizzes) * 100) : 0,
    totalQuizzes,
  };
}

export async function fetchFlaggedDigests(): Promise<DigestItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("digests")
    .select("*")
    .neq("factual_rating", "passed")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching flagged digests:", error);
    return [];
  }

  return data.map((row) => mapDigestRow(row as DigestRow));
}
