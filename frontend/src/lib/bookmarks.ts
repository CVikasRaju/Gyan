import { DigestItem } from '@/lib/data';

export async function getBookmarks(): Promise<DigestItem[]> {
  const res = await fetch('/api/bookmarks', {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
  if (!res.ok) {
    console.error('Failed to fetch bookmarks');
    return [];
  }
  const data = await res.json();
  // API returns array of rows with digests nested
  return data.map((row: any) => ({
    id: row.digests.id,
    title: row.digests.title,
    summary: row.digests.summary_text,
    link: row.digests.source_url,
    source: row.digests.source_name,
    category: row.digests.subject_category,
    pubDate: row.digests.original_published_at,
    qaStatus: row.digests.factual_rating,
  }));
}

export async function addBookmark(digestId: string): Promise<void> {
  await fetch('/api/bookmarks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ digest_id: digestId }),
  });
}

export async function removeBookmark(digestId: string): Promise<void> {
  await fetch('/api/bookmarks', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ digest_id: digestId }),
  });
}
