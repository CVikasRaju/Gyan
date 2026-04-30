import { createClient } from '@/lib/server';

export type DigestItem = {
  id: string;
  title: string;
  summary: string;
  link: string;
  source: string;
  category: string;
  pubDate: string;
  qaStatus: 'passed' | 'flagged' | 'quarantined';
};

export type UserStats = {
  streakCount: number;
  totalXp: number;
  dailyGoal: number;
  articlesReadToday: number;
};

export async function fetchDailyDigest(searchQuery?: string): Promise<DigestItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from('digests')
    .select('*');

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,summary_text.ilike.%${searchQuery}%`);
  }

  const { data, error } = await query
    .order('original_published_at', { ascending: false })
    .limit(30);

  if (error || !data) {
    console.error('Supabase fetch query error:', error);
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    title: row.title || 'Unknown Headline',
    summary: row.summary_text || 'No summary available.',
    link: row.source_url || '#',
    source: row.source_name || 'CurrentAI Publisher Sync',
    category: row.subject_category || 'General',
    pubDate: row.original_published_at || row.created_at,
    qaStatus: row.factual_rating as 'passed' | 'flagged' | 'quarantined' || 'passed',
  }));
}

export async function fetchDigestById(id: string): Promise<DigestItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('digests').select('*').eq('id', id).single();
  if (error || !data) {
    console.error(`Error fetching digest ${id}:`, error);
    return null;
  }
  return {
    id: data.id,
    title: data.title || 'Unknown Headline',
    summary: data.summary_text || 'No summary available.',
    link: data.source_url || '#',
    source: data.source_name || 'CurrentAI Publisher Sync',
    category: data.subject_category || 'General',
    pubDate: data.original_published_at || data.created_at,
    qaStatus: data.factual_rating as 'passed' | 'flagged' | 'quarantined' || 'passed',
  };
}

// New helper: fetch digests filtered by category
export async function fetchDigestsByCategory(category: string): Promise<DigestItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('digests')
    .select('*')
    .eq('subject_category', category)
    .order('original_published_at', { ascending: false });
  if (error || !data) {
    console.error(`Error fetching digests for category ${category}:`, error);
    return [];
  }
  return data.map((row: any) => ({
    id: row.id,
    title: row.title || 'Unknown Headline',
    summary: row.summary_text || 'No summary available.',
    link: row.source_url || '#',
    source: row.source_name || 'CurrentAI Publisher Sync',
    category: row.subject_category || 'General',
    pubDate: row.original_published_at || row.created_at,
    qaStatus: row.factual_rating as 'passed' | 'flagged' | 'quarantined' || 'passed',
  }));
}

export async function fetchUserBookmarks(): Promise<DigestItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data, error } = await supabase
    .from('bookmarks')
    .select('*, digests(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching user bookmarks:', error);
    return [];
  }

  return data.map((row: any) => ({
    id: row.digests.id,
    title: row.digests.title || 'Unknown Headline',
    summary: row.digests.summary_text || 'No summary available.',
    link: row.digests.source_url || '#',
    source: row.digests.source_name || 'CurrentAI Publisher Sync',
    category: row.digests.subject_category || 'General',
    pubDate: row.digests.original_published_at || row.digests.created_at,
    qaStatus: row.digests.factual_rating || 'passed',
  }));
}

export async function fetchUserStats(): Promise<UserStats | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Fetch basic stats
  let { data: stats, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code === 'PGRST116') {
    // Stats don't exist, initialize them
    const { data: newStats, error: initError } = await supabase
      .from('user_stats')
      .insert([{ user_id: user.id, streak_count: 0, total_xp: 0, daily_goal_num: 5 }])
      .select()
      .single();
    
    if (initError) {
      console.error('Error initializing user stats:', initError);
      return null;
    }
    stats = newStats;
  } else if (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }

  // 2. Fetch today's read count
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { count, error: countError } = await supabase
    .from('read_articles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('read_at', today.toISOString());

  if (countError) {
    console.error('Error fetching today read count:', countError);
  }

  return {
    streakCount: stats.streak_count || 0,
    totalXp: stats.total_xp || 0,
    dailyGoal: stats.daily_goal_num || 5,
    articlesReadToday: count || 0,
  };
}

export async function fetchDailyQuizzes(): Promise<any[]> {
  const supabase = await createClient();
  // Fetch quizzes created in the last 24 hours
  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);

  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .gte('created_at', yesterday.toISOString())
    .limit(5);

  if (error || !data) {
    console.error('Error fetching quizzes:', error);
    return [];
  }

  return data;
}

export async function fetchUserPerformance(): Promise<any> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Fetch category breakdown from read articles
  const { data: readData, error: readError } = await supabase
    .from('read_articles')
    .select('digests(subject_category)')
    .eq('user_id', user.id);

  const categories: Record<string, number> = {};
  readData?.forEach((row: any) => {
    const cat = row.digests.subject_category || 'General';
    categories[cat] = (categories[cat] || 0) + 1;
  });

  // 2. Fetch quiz performance
  const { data: quizData, error: quizError } = await supabase
    .from('quiz_attempts')
    .select('is_correct')
    .eq('user_id', user.id);

  const totalQuizzes = quizData?.length || 0;
  const correctQuizzes = quizData?.filter(q => q.is_correct).length || 0;

  return {
    categoryBreakdown: categories,
    quizAccuracy: totalQuizzes > 0 ? Math.round((correctQuizzes / totalQuizzes) * 100) : 0,
    totalQuizzes,
  };
}

export async function fetchFlaggedDigests(): Promise<DigestItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('digests')
    .select('*')
    .neq('factual_rating', 'passed')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching flagged digests:', error);
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    title: row.title || 'Unknown',
    summary: row.summary_text || '',
    link: row.source_url || '#',
    source: row.source_name || 'Sync',
    category: row.subject_category || 'General',
    pubDate: row.created_at,
    qaStatus: row.factual_rating as any,
  }));
}

export async function updateDigestStatus(id: string, status: 'passed' | 'quarantined' | 'flagged'): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('digests')
    .update({ factual_rating: status })
    .eq('id', id);

  if (error) {
    console.error(`Error updating digest ${id}:`, error);
    return false;
  }
  return true;
}






