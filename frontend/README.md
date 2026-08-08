# GYAN — Frontend

Next.js 16 (App Router) + Tailwind CSS v4 + Supabase. Implements the dark editorial design system in [`docs/CurrentAI — Design System.md`](../docs/CurrentAI%20—%20Design%20System.md).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server on <http://localhost:3000> |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Typecheck |
| `npm run check:env` | Validate required env vars are set |

## Environment

Copy `.env.example` to `.env.local` and fill in your Supabase project values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon-public-key>
```

> `NEXT_PUBLIC_*` values are inlined into the client bundle at build time, so they must be referenced statically (`process.env.NEXT_PUBLIC_X`) — see `src/lib/env.ts`.

## Pages

| Route | Description |
|---|---|
| `/` | Daily Digest (hero, filter tabs, featured card, grid) |
| `/article/[id]` | Full briefing with reading progress + related items |
| `/categories` / `/category/[category]` | Category browsing |
| `/quiz` | Daily quiz |
| `/tracker` | Reading streak, XP and goals |
| `/bookmarks` | Saved briefings |
| `/admin` | Editorial dashboard (admins only) |
| `/pricing` · `/login` · `/account` · `/help` | Marketing & account |
| `/api/health` | Supabase connectivity check |

## Structure

```
src/
├── app/          # App Router pages + API routes
├── components/   # Navbar, digest cards, auth, admin, marketing
└── lib/          # Supabase clients (server/client), data layer, env
```

See the [root README](../README.md) for full setup, schema and seeding instructions.
