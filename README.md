<div align="center">

# 📰 GYAN

### Fact-checked. Source-attributed. Ad-free.

**GYAN** is an AI-powered current affairs digest platform. It curates news from trusted sources, summarizes it with LLMs, fact-checks every briefing, and delivers a clean daily reading experience — with zero ads and full source attribution.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![n8n](https://img.shields.io/badge/n8n-1FAD9F?logo=n8n&logoColor=white)](https://n8n.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## ✨ Features

| | |
|---|---|
| 🗞️ **Daily Digest** | Curated, LLM-summarized briefings ranked by source quality |
| ✅ **Fact-checking pipeline** | Every item rated `passed` / `flagged` / `quarantined` before it can publish |
| 🔍 **Source attribution** | Every briefing links to the original article — no ads, no noise |
| 🧠 **Daily Quiz** | Test yourself with AI-generated questions tied to each briefing |
| 📊 **Study tracker** | Reading streaks, XP, daily goals and performance history |
| 🔖 **Bookmarks** | Save briefings to read later, synced to your account |
| 🏷️ **Categories** | Politics, Economy, Science, Technology, World, Health |
| 🌗 **Dark / light theme** | Toggle in the navbar; persisted to your OS preference |
| 🛡️ **Editorial dashboard** | Approve, flag or quarantine items with RLS-protected admin access |
| 🤖 **n8n pipeline** | Fully automated RSS → scrape → summarize → fact-check ingestion |

## 🧱 Architecture

```
┌─────────────┐      ┌──────────────────────────────────────────────┐
│  n8n (Docker)│      │             Next.js 16 frontend              │
│  RSS feeds   │─────▶│  Daily Digest · Article · Quiz · Tracker     │
│  + scraper   │      │  Bookmarks · Admin · Pricing · Login · Help  │
└──────┬───────┘      └───────────────┬──────────────────────────────┘
       │ HTTP/JSON                     │ supabase-js (anon + RLS)
       ▼                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Supabase (Postgres)                          │
│  digests · bookmarks · user_stats · read_articles · quizzes       │
│  quiz_attempts   +   Row Level Security + is_admin() helper       │
└──────────────────────────────────────────────────────────────────┘
```

**Data flow:** n8n reads RSS feeds → Python scraper extracts article text → LLM (Gemini/DeepSeek/Claude) summarizes → fact-check stage rates each item → `INSERT` into `digests` (service role) → RLS exposes only `passed` items to readers → editors review flagged/quarantined items in `/admin`.

## 📁 Project structure

```
├── frontend/            # Next.js 16 + Tailwind v4 app
│   ├── src/app/         # Pages (App Router) + API routes
│   ├── src/components/  # Navbar, cards, auth, admin, marketing UI
│   └── src/lib/         # Supabase clients, data layer, env helpers
├── backend/
│   ├── schema.sql       # Canonical database schema + RLS policies
│   ├── alter_schema.sql # Idempotent migration for existing databases
│   ├── seed.sql         # Rich demo data (18 digests, 5 quizzes)
│   ├── scripts/         # db.mjs — DB runner (check/verify/apply/reset)
│   ├── n8n/             # Ingestion workflows + docker-compose
│   └── scraper/         # FastAPI article extractor used by n8n
├── docs/                # Product spec + design system
└── .github/workflows/   # CI (lint, typecheck, build)
```

## 🚀 Getting started

### Prerequisites

- Node.js 20+
- A free [Supabase](https://supabase.com) project
- (Optional) Docker for the n8n + scraper pipeline

### 1. Install frontend dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

```bash
# frontend/.env.local  — required for the app to boot
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon-public-key>
```

Copy `frontend/.env.example`, `.env.example` and `backend/n8n/.env.example` as starting points.
**Never commit real keys** — every `.env*` file is gitignored.

| Variable | Where | Required | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `frontend/.env.local` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `frontend/.env.local` | ✅ | Anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | root `.env` | pipeline | Server-side writes, bypasses RLS |
| `SUPABASE_CONNECTION_STRING` | root `.env` | seeding | psql / `db.mjs` access |
| `N8N_ENCRYPTION_KEY` / `N8N_WEBHOOK_SECRET` | `backend/n8n/.env` | pipeline | n8n config |
| `GEMINI_API_KEY` | `backend/n8n/.env` | pipeline | Summarization model |

### 3. Create the schema & seed data

**Option A — Supabase SQL editor (recommended):** run `backend/schema.sql`, then `backend/seed.sql`.

**Option B — psql:**

```bash
psql "$SUPABASE_CONNECTION_STRING" -f backend/schema.sql
psql "$SUPABASE_CONNECTION_STRING" -f backend/seed.sql
```

**Option C — built-in runner (no psql needed):**

```bash
cd backend
npm install          # installs pg
node scripts/db.mjs check    # inspect existing tables
node scripts/db.mjs verify   # digest/functions/policies summary
node scripts/db.mjs apply seed.sql
node scripts/db.mjs reset    # drop + schema + seed (fresh DB)
```

> `backend/alter_schema.sql` is an idempotent migration for databases created before the current schema — safe to run on any existing DB.

### 4. Make yourself an editor (for `/admin`)

```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role":"admin"}'::jsonb
WHERE email = 'your@email.com';
```

The Editorial Dashboard relies on RLS policies that grant admins (`role: admin` or `@gyan.ai` emails) read + update on all digests.

### 5. Run the app

```bash
cd frontend
npm run dev
```

- App: <http://localhost:3000>
- Health check: <http://localhost:3000/api/health>
- n8n: <http://localhost:5678> · Scraper: <http://localhost:8000>

## 🧪 Quality gates

```bash
cd frontend
npm run lint        # ESLint
npx tsc --noEmit    # TypeScript
npm run build       # Production build
```

CI runs all three on every push/PR (`.github/workflows/ci.yml`).

## 🔒 Security model

- **RLS everywhere** — every table has Row Level Security enabled. Anonymous readers see **only** `passed` digests with a summary; flagged/quarantined items are visible exclusively to admins.
- **`is_admin()`** — a `SECURITY DEFINER` function with a hardened empty `search_path` checks `auth.users` metadata; never exposed to clients.
- **Service role key** lives only in server-side env files and is never bundled — the client uses the anon key only.
- **Secrets hygiene** — `.env*` patterns are gitignored at the root; the repo history is kept free of credentials.

## 📜 License

[MIT](LICENSE) © Vikas Raju

---

<div align="center">Built with Next.js, Supabase & n8n · Designed per the spec in <code>docs/</code></div>
