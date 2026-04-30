import React from 'react';
import { DigestCard } from '@/components/feed/DigestCard';
import { fetchDigestsByCategory } from '@/lib/data';

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const decodedCategory = decodeURIComponent(resolvedParams.category);
  const digests = await fetchDigestsByCategory(decodedCategory);

  return (
    <div className="flex-1 overflow-y-auto px-gutter py-margin-page">
      <header className="mb-stack-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary">folder_open</span>
          <p className="font-label-caps text-outline uppercase tracking-wider">Category Briefing</p>
        </div>
        <h2 className="font-headline-xl text-on-background">
          {decodedCategory}
        </h2>
      </header>

      {digests.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-stack-lg">
          {digests.map((item) => (
            <DigestCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant gap-4">
          <span className="material-symbols-outlined text-[56px]">newspaper</span>
          <p className="font-body-lg text-center">No briefings found in this category yet.</p>
          <a href="/" className="mt-2 text-primary font-label-md hover:underline">
            View All Briefings
          </a>
        </div>
      )}
    </div>
  );
}
