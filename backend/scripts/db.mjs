#!/usr/bin/env node
/**
 * GYAN database migration runner.
 * Usage:
 *   node scripts/db.mjs check              -- list existing tables + row counts
 *   node scripts/db.mjs verify             -- summary of digests, functions, RLS policies
 *   node scripts/db.mjs apply <file.sql>   -- run a SQL file (in a transaction)
 *   node scripts/db.mjs reset              -- drop public tables, apply schema, then seed
 *
 * Reads SUPABASE_CONNECTION_STRING from root .env (or the environment).
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CONN = process.env.SUPABASE_CONNECTION_STRING || readRootEnv("SUPABASE_CONNECTION_STRING");

if (!CONN) {
  console.error("Missing SUPABASE_CONNECTION_STRING (set it in .env or the environment).");
  process.exit(1);
}

function readRootEnv(key) {
  const envPath = resolve(ROOT, ".env");
  if (!existsSync(envPath)) return undefined;
  const line = readFileSync(envPath, "utf8").split("\n").find((l) => l.startsWith(`${key}=`));
  return line ? line.slice(key.length + 1).trim() : undefined;
}

// rejectUnauthorized: false is intentional — Supabase presents a self-signed
// cert on the direct connection; this is a local dev/admin tool, not a server.
const client = new pg.Client({ connectionString: CONN, ssl: { rejectUnauthorized: false } });

async function main() {
  await client.connect();
  const [,, command, arg] = process.argv;

  if (command === "check") {
    const { rows } = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    if (rows.length === 0) {
      console.log("No public tables yet — database is fresh.");
    } else {
      for (const { table_name } of rows) {
        try {
          const c = await client.query(`SELECT count(*)::int AS n FROM public.${table_name}`);
          console.log(`${table_name.padEnd(18)} ${c.rows[0].n} rows`);
        } catch {
          console.log(`${table_name.padEnd(18)} (unreadable)`);
        }
      }
    }
  } else if (command === "verify") {
    const rating = await client.query(
      "SELECT factual_rating, count(*)::int AS n FROM public.digests GROUP BY 1 ORDER BY 1"
    );
    console.log("digests by rating:");
    for (const r of rating.rows) console.log(`  ${String(r.factual_rating).padEnd(12)} ${r.n}`);

    const cat = await client.query(
      "SELECT subject_category, count(*)::int AS n FROM public.digests GROUP BY 1 ORDER BY 2 DESC"
    );
    console.log("digests by category:");
    for (const r of cat.rows) console.log(`  ${String(r.subject_category).padEnd(12)} ${r.n}`);

    const fn = await client.query(
      "SELECT proname FROM pg_proc WHERE proname IN ('is_admin','increment_user_xp') ORDER BY 1"
    );
    console.log("functions:", fn.rows.map((r) => r.proname).join(", "));

    const pol = await client.query(
      "SELECT tablename, count(*)::int AS n FROM pg_policies WHERE schemaname='public' GROUP BY 1 ORDER BY 1"
    );
    console.log("RLS policies:");
    for (const r of pol.rows) console.log(`  ${String(r.tablename).padEnd(14)} ${r.n}`);
  } else if (command === "apply") {
    if (!arg) {
      console.error("Usage: node scripts/db.mjs apply <file.sql>");
      process.exit(1);
    }
    const sql = readFileSync(resolve(ROOT, "backend", arg), "utf8");
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
    console.log(`Applied ${arg} ✓`);
  } else if (command === "reset") {
    console.log("Dropping public tables...");
    await client.query("BEGIN");
    try {
      await client.query(`
        DROP TABLE IF EXISTS public.quiz_attempts CASCADE;
        DROP TABLE IF EXISTS public.quizzes CASCADE;
        DROP TABLE IF EXISTS public.read_articles CASCADE;
        DROP TABLE IF EXISTS public.user_stats CASCADE;
        DROP TABLE IF EXISTS public.bookmarks CASCADE;
        DROP TABLE IF EXISTS public.digests CASCADE;
      `);
      console.log("Applying schema.sql...");
      await client.query(readFileSync(resolve(ROOT, "backend", "schema.sql"), "utf8"));
      console.log("Applying seed.sql...");
      await client.query(readFileSync(resolve(ROOT, "backend", "seed.sql"), "utf8"));
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
    console.log("Reset complete ✓");
  } else {
    console.error("Usage: node scripts/db.mjs check | verify | apply <file.sql> | reset");
    process.exit(1);
  }

  await client.end();
}

main().catch(async (err) => {
  console.error("ERROR:", err.message);
  try {
    await client.end();
  } catch {}
  process.exit(1);
});
