import { createBrowserClient } from '@supabase/ssr';
import { getPublicSupabaseEnv } from './env';

const env = getPublicSupabaseEnv();

export const supabase = createBrowserClient(env.url, env.publishableKey);
