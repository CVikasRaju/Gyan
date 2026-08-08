import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(process.cwd(), '.env.local');
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
];

if (!existsSync(envPath)) {
  console.error('Missing frontend/.env.local. Copy frontend/.env.example first.');
  process.exit(1);
}

const content = readFileSync(envPath, 'utf8');
const missing = required.filter((key) => {
  const match = content.match(new RegExp(`^${key}=(.+)$`, 'm'));
  return !match || !match[1] || match[1].startsWith('your-');
});

if (missing.length > 0) {
  console.error(`Missing required env values: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Frontend environment looks ready.');
