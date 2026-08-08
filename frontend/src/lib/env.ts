type PublicSupabaseEnv = {
  url: string;
  publishableKey: string;
};

/**
 * NOTE: NEXT_PUBLIC_* variables MUST be referenced statically
 * (process.env.NEXT_PUBLIC_X) so Next.js can inline their values into the
 * client bundle at build time. Dynamic access like process.env[name] compiles
 * to undefined in the browser and crashes client components.
 */
function requireEnv(value: string | undefined, name: string): string {
  if (!value || value.trim().length === 0 || value.startsWith("your-")) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getPublicSupabaseEnv(): PublicSupabaseEnv {
  return {
    url: requireEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    publishableKey: requireEnv(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    ),
  };
}

export function getOptionalEnvStatus(): Record<string, boolean> {
  return {
    serviceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    connectionString: Boolean(process.env.SUPABASE_CONNECTION_STRING),
    geminiApiKey: Boolean(process.env.GEMINI_API_KEY),
    n8nWebhookSecret: Boolean(process.env.N8N_WEBHOOK_SECRET),
  };
}
