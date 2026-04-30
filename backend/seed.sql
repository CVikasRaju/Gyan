-- Run this in your Supabase Dashboard SQL Editor to populate dummy data
-- Make sure to run schema.sql AND alter_schema.sql first!

INSERT INTO public.digests (
  title, 
  summary_text, 
  subject_category, 
  source_url, 
  source_name, 
  original_published_at, 
  factual_rating, 
  qa_status_tag, 
  llm_model_used
) VALUES 
(
  'Global Markets Rally Despite Interest Rate Uncertainty',
  'Major stock indexes hit new heights today as investors shrugged off the Federal Reserve''s ambiguous guidance regarding future rate cuts. The technology sector lead the surge.',
  'Economy',
  'https://example.com/markets-rally-1',
  'Financial Times',
  now() - interval '2 hours',
  'passed',
  'Verified by FactChecker',
  'gpt-4'
),
(
  'Breakthrough in Quantum Computing Efficiency',
  'Researchers at MIT have discovered a novel material matrix capable of maintaining qubit coherence at significantly higher temperatures than previously recorded, paving the way for scalable quantum systems.',
  'Science',
  'https://example.com/quantum-breakthrough',
  'Nature',
  now() - interval '5 hours',
  'passed',
  'Verified by Editorial',
  'claude-3-opus'
),
(
  'New Legislation Proposed on Tech Monopolies',
  'A sweeping bipartisan bill was introduced in the Senate this morning aimed at fundamentally restructuring how major tech platforms handle third-party competitors on their marketplaces.',
  'Politics',
  'https://example.com/tech-bill',
  'Politico',
  now() - interval '1 day',
  'passed',
  'Auto-Verified',
  'gpt-4'
);
