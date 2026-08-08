-- ============================================================
-- GYAN — Migration for databases created before the current schema.
-- Fresh databases should run backend/schema.sql only.
-- Safe to run on ANY existing database (all statements are idempotent).
-- ============================================================

-- 1. digests.title (added after the original schema)
ALTER TABLE public.digests
ADD COLUMN IF NOT EXISTS title text;

---------------------------------------------------------
-- 2. Tables that may be missing on older databases
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_count int DEFAULT 0,
  last_read_at timestamptz,
  total_xp int DEFAULT 0,
  articles_read_count int DEFAULT 0,
  daily_goal_num int DEFAULT 5,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.read_articles (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  digest_id uuid NOT NULL REFERENCES public.digests(id) ON DELETE CASCADE,
  read_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, digest_id)
);
ALTER TABLE public.read_articles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  digest_id uuid REFERENCES public.digests(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_option_index int NOT NULL,
  explanation text,
  difficulty text DEFAULT 'medium',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid REFERENCES public.quizzes(id) ON DELETE CASCADE,
  is_correct boolean NOT NULL,
  score_earned int DEFAULT 10,
  attempted_at timestamptz DEFAULT now()
);
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

---------------------------------------------------------
-- 3. Indexes
---------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_digests_rating_published ON public.digests (factual_rating, original_published_at DESC);
CREATE INDEX IF NOT EXISTS idx_digests_category ON public.digests (subject_category);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks (user_id);

---------------------------------------------------------
-- 4. RLS policies (dropped first so re-runs are safe)
---------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read access to passed digests" ON public.digests;
CREATE POLICY "Allow public read access to passed digests" ON public.digests
  FOR SELECT USING (factual_rating = 'passed' AND summary_text IS NOT NULL);

DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can insert their own bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_stats;
CREATE POLICY "Users can view their own stats" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;
CREATE POLICY "Users can update their own stats" ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own stats" ON public.user_stats;
CREATE POLICY "Users can insert their own stats" ON public.user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own read history" ON public.read_articles;
CREATE POLICY "Users can view their own read history" ON public.read_articles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can mark articles as read" ON public.read_articles;
CREATE POLICY "Users can mark articles as read" ON public.read_articles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Everyone can read quizzes" ON public.quizzes;
CREATE POLICY "Everyone can read quizzes" ON public.quizzes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view their own attempts" ON public.quiz_attempts;
CREATE POLICY "Users can view their own attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can record their attempts" ON public.quiz_attempts;
CREATE POLICY "Users can record their attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

---------------------------------------------------------
-- 5. Functions & RPCs
---------------------------------------------------------
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
-- 6. Admin / Editor helpers (frontend editorial dashboard)
-- Empty search_path + fully-qualified names prevent search-path hijacking.
---------------------------------------------------------
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

DROP POLICY IF EXISTS "Admins can read all digests" ON public.digests;
CREATE POLICY "Admins can read all digests" ON public.digests
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update digests" ON public.digests;
CREATE POLICY "Admins can update digests" ON public.digests
  FOR UPDATE USING (public.is_admin());
