-- CurrentAI Database Schema
-- Run this in your Supabase Dashboard SQL Editor

---------------------------------------------------------
-- 1. Table: digests 
-- (Unified storage for pipeline ingestion + frontend UI)
---------------------------------------------------------
CREATE TABLE public.digests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  summary_text text, -- Nullable because it might be flagged before parsing
  subject_category text,
  source_url text NOT NULL UNIQUE,
  source_name text,
  original_published_at timestamptz,
  factual_rating text CHECK (factual_rating IN ('passed', 'flagged', 'quarantined')),
  qa_status_tag text,
  llm_model_used text,
  n8n_batch_id text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.digests ENABLE ROW LEVEL SECURITY;

-- Policy: Readers can only see fully verified ('passed') content
CREATE POLICY "Allow public read access to passed digests" ON public.digests
  FOR SELECT USING (
    factual_rating = 'passed' AND summary_text IS NOT NULL
  );
  
-- Note: n8n uses the Supabase 'Service Role' Key to perform INSERTS and UPDATES, 
-- which inherently bypasses RLS. We do not need public INSERT policies here.

---------------------------------------------------------
-- 2. Table: bookmarks 
-- (Stores user-saved articles)
---------------------------------------------------------
CREATE TABLE public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  digest_id uuid NOT NULL REFERENCES public.digests(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, digest_id) -- A user can only bookmark a digest once
);

-- Enable RLS
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies: Authenticated users can manage their own bookmarks
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

---------------------------------------------------------
-- 3. Performance Indexes (Supabase Best Practices)
---------------------------------------------------------
-- Fast filtering for the Daily Digest frontend view
CREATE INDEX idx_digests_rating_published ON public.digests (factual_rating, original_published_at DESC);

-- Fast filtering by category in the UI
CREATE INDEX idx_digests_category ON public.digests (subject_category);

-- Fast lookups for checking if a user has already bookmarked a digest
CREATE INDEX idx_bookmarks_user ON public.bookmarks (user_id);

---------------------------------------------------------
-- 4. Table: user_stats 
-- (Tracks gamification metrics)
---------------------------------------------------------
CREATE TABLE public.user_stats (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_count int DEFAULT 0,
  last_read_at timestamptz,
  total_xp int DEFAULT 0,
  articles_read_count int DEFAULT 0,
  daily_goal_num int DEFAULT 5, -- Number of articles to read per day
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stats" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

---------------------------------------------------------
-- 5. Table: read_articles 
-- (Tracks which articles a user has read)
---------------------------------------------------------
CREATE TABLE public.read_articles (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  digest_id uuid NOT NULL REFERENCES public.digests(id) ON DELETE CASCADE,
  read_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, digest_id)
);

-- Enable RLS
ALTER TABLE public.read_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own read history" ON public.read_articles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can mark articles as read" ON public.read_articles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

---------------------------------------------------------
-- 6. Table: quizzes 
-- (AI-generated questions linked to digests)
---------------------------------------------------------
CREATE TABLE public.quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  digest_id uuid REFERENCES public.digests(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL, -- Array of strings
  correct_option_index int NOT NULL,
  explanation text,
  difficulty text DEFAULT 'medium',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read quizzes" ON public.quizzes
  FOR SELECT USING (true);

---------------------------------------------------------
-- 7. Table: quiz_attempts 
-- (Tracks user performance on quizzes)
---------------------------------------------------------
CREATE TABLE public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid REFERENCES public.quizzes(id) ON DELETE CASCADE,
  is_correct boolean NOT NULL,
  score_earned int DEFAULT 10,
  attempted_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can record their attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

---------------------------------------------------------
-- 8. Functions & RPCs
---------------------------------------------------------
-- Atomically increment user XP
CREATE OR REPLACE FUNCTION public.increment_user_xp(user_id_param uuid, xp_to_add int)
RETURNS void AS $$
BEGIN
  UPDATE public.user_stats
  SET total_xp = total_xp + xp_to_add,
      updated_at = now()
  WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

---------------------------------------------------------
-- 9. Admin / Editor helpers (frontend editorial dashboard)
---------------------------------------------------------
-- True when the current user is a Gyan editor or admin.
-- Empty search_path + fully-qualified names prevent search-path hijacking.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
      AND (
        raw_user_meta_data ->> 'role' = 'admin'
        OR email LIKE '%@gyan.ai'
      )
  );
$$;

-- Editors can read every digest, including flagged / quarantined items.
CREATE POLICY "Admins can read all digests" ON public.digests
  FOR SELECT USING (public.is_admin());

-- Editors can update digest status (approve / flag / quarantine).
CREATE POLICY "Admins can update digests" ON public.digests
  FOR UPDATE USING (public.is_admin());

-- Readers can initialise their own stats row on first visit.
CREATE POLICY "Users can insert their own stats" ON public.user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);




