import { NextResponse } from 'next/server';
import { getOptionalEnvStatus, getPublicSupabaseEnv } from '@/lib/env';
import { createClient } from '@/lib/server';

export async function GET() {
  try {
    const env = getPublicSupabaseEnv();
    const supabase = await createClient();
    const { error } = await supabase.from('digests').select('id', { count: 'exact', head: true });

    return NextResponse.json({
      status: error ? 'degraded' : 'ok',
      supabase: {
        configured: Boolean(env.url && env.publishableKey),
        reachable: !error,
        detail: error?.message ?? 'Connected',
      },
      optional: getOptionalEnvStatus(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        supabase: {
          configured: false,
          reachable: false,
          detail: error instanceof Error ? error.message : 'Unknown connection error',
        },
        optional: getOptionalEnvStatus(),
      },
      { status: 500 },
    );
  }
}
