import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getPublicSupabaseEnv } from './env';

let client: SupabaseClient | null = null;

/**
 * Lazily creates (and memoizes) the browser Supabase client.
 *
 * IMPORTANT: the client must be created on first use — inside effects or
 * event handlers — never at module scope. An eager `const supabase =
 * createBrowserClient(...)` caused this module to evaluate
 * `getPublicSupabaseEnv()` during build-time prerendering of static pages
 * (e.g. /_not-found), which threw "Missing required environment variable"
 * when NEXT_PUBLIC_* vars weren't set on the build machine (e.g. Vercel).
 */
export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    const env = getPublicSupabaseEnv();
    client = createBrowserClient(env.url, env.publishableKey);
  }
  return client;
}
