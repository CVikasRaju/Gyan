-- ============================================================
-- GYAN — Rich demo seed
-- Run backend/schema.sql FIRST (fresh database), then this file.
-- Safe to run multiple times (digests upsert on source_url).
--
-- To make yourself an editor (for /admin), run after signing up:
--   UPDATE auth.users
--   SET raw_user_meta_data = raw_user_meta_data || '{"role":"admin"}'::jsonb
--   WHERE email = 'your@email.com';
--
-- NOTE: source_url values are illustrative demo placeholders.
-- ============================================================

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
)
VALUES
  -- ── Politics ──────────────────────────────────────────────
  (
    'Parliament Passes Sweeping Data-Protection Bill After Bipartisan Deal',
    'Lawmakers approved a landmark data-protection framework after months of negotiation. The bill introduces stricter consent rules for large platforms, a new independent regulator, and steep fines for repeat violations. Analysts say it reshapes how personal data flows across borders.',
    'Politics',
    'https://www.reuters.com/world/politics/data-protection-bill-passes-2026',
    'Reuters',
    now() - interval '2 hours',
    'passed',
    'Verified by FactChecker',
    'gemini-2.5-flash'
  ),
  (
    'Coalition Talks Enter Final Stretch as Budget Deadline Looms',
    'The ruling coalition faces a tight deadline to finalise the annual budget. A senior negotiator said a deal on agricultural subsidies is close, but pension reform remains the sticking point. Markets are watching closely for signs of a snap election.',
    'Politics',
    'https://www.bbc.com/news/world-politics-coalition-budget-2026',
    'BBC News',
    now() - interval '6 hours',
    'passed',
    'Auto-Verified',
    'deepseek-v3.2'
  ),
  (
    'Supreme Court Hears Landmark Case on Electoral District Boundaries',
    'The court convened to hear arguments on whether recent redistricting diluted minority representation. Legal experts call it the most consequential election-law case of the decade, with potential implications for upcoming state and national polls.',
    'Politics',
    'https://www.nytimes.com/supreme-court-redistricting-arguments-2026',
    'The New York Times',
    now() - interval '2 days',
    'flagged',
    'Needs editorial review: source quotes unverified analyst',
    'claude-opus-4'
  ),

  -- ── Economy ───────────────────────────────────────────────
  (
    'Global Markets Rally Despite Interest-Rate Uncertainty',
    'Major stock indexes hit new heights as investors shrugged off ambiguous central-bank guidance on future rate cuts. The technology sector led the surge, with semiconductor and AI-infrastructure names posting double-digit weekly gains.',
    'Economy',
    'https://www.ft.com/markets-rally-rate-uncertainty-2026',
    'Financial Times',
    now() - interval '3 hours',
    'passed',
    'Verified by FactChecker',
    'gemini-2.5-flash'
  ),
  (
    'Central Bank Holds Rates Steady, Signals Patience on Inflation',
    'Policymakers left the benchmark rate unchanged for a third consecutive meeting, citing cooling but still-elevated inflation. The governor stressed that rate cuts remain data-dependent, disappointing traders who had priced in an earlier easing.',
    'Economy',
    'https://www.bloomberg.com/central-bank-holds-rates-2026',
    'Bloomberg',
    now() - interval '9 hours',
    'passed',
    'Auto-Verified',
    'deepseek-v3.2'
  ),
  (
    'Supply-Chain Pressures Ease as Freight Costs Return to Pre-Pandemic Levels',
    'A new industry report shows global container freight rates have fallen to levels last seen in 2019. Easing congestion at major ports and a recovery in manufacturing output point to a stabilising global trade environment through the year.',
    'Economy',
    'https://www.economist.com/freight-costs-ease-2026',
    'The Economist',
    now() - interval '4 days',
    'passed',
    'Verified by Editorial',
    'gpt-4.1'
  ),

  -- ── Science ───────────────────────────────────────────────
  (
    'Breakthrough in Quantum Computing Efficiency at Room Temperature',
    'Researchers demonstrated qubit coherence at significantly higher temperatures than previously recorded using a novel material matrix. The advance could make scalable quantum systems far more practical, though commercial deployment remains years away.',
    'Science',
    'https://www.nature.com/quantum-coherence-breakthrough-2026',
    'Nature',
    now() - interval '4 hours',
    'passed',
    'Verified by FactChecker',
    'gemini-2.5-flash'
  ),
  (
    'New Vaccine Candidate Shows 90% Efficacy in Late-Stage Malaria Trial',
    'A phase-III trial of a next-generation malaria vaccine reported 90% efficacy in children under five, the population most affected by the disease. Researchers caution that cold-chain logistics and cost remain key hurdles for rollout across Africa.',
    'Science',
    'https://www.thelancet.com/malaria-vaccine-trial-2026',
    'The Lancet',
    now() - interval '1 day 3 hours',
    'quarantined',
    'Quarantined: efficacy figures pending independent audit',
    'claude-opus-4'
  ),
  (
    'Deep-Sea Expedition Maps 40,000 Square Kilometres of Unexplored Ocean Floor',
    'An international research vessel returned with high-resolution sonar maps of a previously uncharted trench system. The expedition also catalogued dozens of new species, deepening our understanding of one of the least-studied ecosystems on Earth.',
    'Science',
    'https://www.science.org/deep-sea-mapping-expedition-2026',
    'Science',
    now() - interval '3 days',
    'passed',
    'Auto-Verified',
    'deepseek-v3.2'
  ),

  -- ── Technology ────────────────────────────────────────────
  (
    'Regulators Open Formal Probe Into AI Model Training Practices',
    'Competition authorities launched an investigation into how frontier AI models are trained, focusing on exclusive data deals and potential barriers for smaller developers. The probe could lead to new transparency rules for foundation-model providers.',
    'Technology',
    'https://www.wired.com/ai-training-regulator-probe-2026',
    'Wired',
    now() - interval '5 hours',
    'passed',
    'Verified by Editorial',
    'gpt-4.1'
  ),
  (
    'Chipmakers Unveil 2-Nanometre Process With 30% Efficiency Gain',
    'A leading semiconductor foundry detailed its next-generation 2nm node, promising a 30% improvement in power efficiency over current chips. Production is expected to ramp in two years, with smartphones and data-centre accelerators as first adopters.',
    'Technology',
    'https://www.technologyreview.com/2nm-chip-process-2026',
    'MIT Technology Review',
    now() - interval '1 day',
    'passed',
    'Auto-Verified',
    'deepseek-v3.2'
  ),
  (
    'Open-Source Model Matches Proprietary Rivals on Reasoning Benchmarks',
    'A community-built language model posted results on par with leading proprietary systems across standard reasoning benchmarks. Developers attribute the gains to novel training-data curation, raising questions about the moat of closed labs.',
    'Technology',
    'https://www.theverge.com/open-source-model-benchmarks-2026',
    'The Verge',
    now() - interval '6 days',
    'passed',
    'Verified by FactChecker',
    'gemini-2.5-flash'
  ),

  -- ── World ─────────────────────────────────────────────────
  (
    'Pacific Nations Sign Historic Climate-Migration Accord',
    'Eight island nations ratified a framework for managing climate-driven displacement, including shared resettlement pathways and a regional resilience fund. The accord is the first legally binding instrument of its kind and enters force next year.',
    'World',
    'https://www.aljazeera.com/pacific-climate-migration-accord-2026',
    'Al Jazeera',
    now() - interval '7 hours',
    'passed',
    'Verified by Editorial',
    'gpt-4.1'
  ),
  (
    'G20 Finance Ministers Agree on Debt-Relief Framework for Low-Income Economies',
    'Finance ministers reached a consensus on restructuring terms for sovereign debt held by low-income nations, including longer grace periods and climate-linked repayment clauses. Observers called the deal a meaningful step toward a fairer global financial system.',
    'World',
    'https://www.dw.com/g20-debt-relief-framework-2026',
    'Deutsche Welle',
    now() - interval '2 days 2 hours',
    'passed',
    'Auto-Verified',
    'deepseek-v3.2'
  ),
  (
    'Cross-Border Rail Link Opens, Cutting Transit Time Between Two Capitals by Half',
    'A high-speed rail corridor connecting the capitals of two neighbouring states began operations, reducing journey times from twelve to six hours. Officials project the link will boost bilateral trade and tourism within the first year.',
    'World',
    'https://www.theguardian.com/cross-border-rail-opens-2026',
    'The Guardian',
    now() - interval '5 days',
    'flagged',
    'Needs editorial review: conflicting passenger numbers',
    'claude-opus-4'
  ),

  -- ── Health ────────────────────────────────────────────────
  (
    'WHO Reports Progress in Eliminating Neglected Tropical Diseases',
    'The World Health Organization said twelve countries eliminated at least one neglected tropical disease last year, the largest annual gain on record. Mass drug administration and improved water access drove most of the progress.',
    'Health',
    'https://www.who.int/ntd-elimination-progress-2026',
    'World Health Organization',
    now() - interval '8 hours',
    'passed',
    'Verified by FactChecker',
    'gemini-2.5-flash'
  ),
  (
    'Study Links Green-Space Access to Lower Rates of Urban Anxiety',
    'A longitudinal study of 120,000 urban residents found that people living within 300 metres of a park reported significantly lower anxiety scores. Researchers recommend integrating green space targets into urban planning guidelines.',
    'Health',
    'https://www.healthline.com/green-space-anxiety-study-2026',
    'Healthline',
    now() - interval '1 day 6 hours',
    'passed',
    'Auto-Verified',
    'deepseek-v3.2'
  ),
  (
    'National Health Service Rolls Out AI Triage Across Emergency Departments',
    'Hospitals began deploying an AI triage assistant that flags high-risk patients for immediate review. Early data suggests a 20% reduction in average wait times, though clinicians stress the system supports — not replaces — human judgement.',
    'Health',
    'https://www.npr.org/ai-triage-emergency-rollout-2026',
    'NPR',
    now() - interval '4 days',
    'passed',
    'Verified by Editorial',
    'gpt-4.1'
  );

-- ============================================================
-- Quizzes (linked to the digests above)
-- ============================================================
INSERT INTO public.quizzes (digest_id, question, options, correct_option_index, explanation, difficulty, created_at)
SELECT d.id, q.question, q.options::jsonb, q.correct_option_index, q.explanation, q.difficulty, now()
FROM (VALUES
  (
    'https://www.reuters.com/world/politics/data-protection-bill-passes-2026',
    'What did the newly passed data-protection bill introduce?',
    '["A new independent regulator", "A ban on all online advertising", "Free public Wi-Fi for citizens", "A national digital currency"]',
    0,
    'The bill creates a new independent regulator, stricter consent rules and steep fines for repeat violations.',
    'medium'
  ),
  (
    'https://www.ft.com/markets-rally-rate-uncertainty-2026',
    'Which sector led the market surge described in the briefing?',
    '["Banking", "Technology", "Energy", "Healthcare"]',
    1,
    'The technology sector led the rally, with semiconductors and AI-infrastructure names posting double-digit gains.',
    'easy'
  ),
  (
    'https://www.nature.com/quantum-coherence-breakthrough-2026',
    'What key barrier did the quantum research advance address?',
    '["Error correction at scale", "Qubit coherence at higher temperatures", "Quantum networking speeds", "Qubit fabrication cost"]',
    1,
    'Researchers demonstrated qubit coherence at significantly higher temperatures using a novel material matrix.',
    'hard'
  ),
  (
    'https://www.aljazeera.com/pacific-climate-migration-accord-2026',
    'What makes the Pacific climate-migration accord notable?',
    '["It is the first legally binding instrument of its kind", "It bans all migration", "It creates a single Pacific currency", "It was signed by all UN members"]',
    0,
    'The accord is the first legally binding framework for climate-driven displacement, entering force next year.',
    'medium'
  ),
  (
    'https://www.who.int/ntd-elimination-progress-2026',
    'How many countries eliminated at least one neglected tropical disease last year?',
    '["Five", "Eight", "Twelve", "Twenty"]',
    2,
    'Twelve countries eliminated at least one neglected tropical disease — the largest annual gain on record.',
    'easy'
  )
) AS q(source_url, question, options, correct_option_index, explanation, difficulty)
JOIN public.digests d ON d.source_url = q.source_url
WHERE NOT EXISTS (
  SELECT 1 FROM public.quizzes WHERE public.quizzes.question = q.question
);
