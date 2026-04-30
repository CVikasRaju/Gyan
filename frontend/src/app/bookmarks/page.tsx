import React from 'react';
import { DigestCard } from '@/components/feed/DigestCard';
import { fetchUserBookmarks } from '@/lib/data';

export const revalidate = 60;

export default async function BookmarksPage() {
  const bookmarks = await fetchUserBookmarks();

  return (
    <div className="min-h-full px-gutter py-margin-page max-w-container-max mx-auto">

      {/* Page Header */}
      <header className="mb-stack-lg">
        <h2 className="font-headline-xl text-headline-xl text-primary mb-stack-md">Bookmarks</h2>
        {/* Tabs */}
        <div className="flex gap-stack-lg border-b border-surface-variant">
          <button className="pb-stack-sm border-b-2 border-primary font-label-md text-primary">
            Saved Articles
          </button>
          <button className="pb-stack-sm font-label-md text-on-surface-variant hover:text-primary transition-colors">
            Saved Questions
          </button>
        </div>
      </header>

      {/* Content Grid */}
      {bookmarks && bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-stack-lg">
          {bookmarks.map((item) => (
            <article
              key={item.id}
              className="bg-surface-container-lowest rounded-xl custom-shadow overflow-hidden flex flex-col group relative border border-transparent hover:border-outline-variant transition-colors duration-300"
            >
              {/* Image placeholder */}
              <div className="relative h-48 w-full bg-surface-container flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-[64px] text-on-surface-variant/20">article</span>
                {/* Delete bookmark button */}
                <button
                  aria-label="Remove from bookmarks"
                  className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-sm p-2 rounded-full text-outline hover:text-error hover:bg-error-container transition-colors shadow-sm flex items-center justify-center z-10"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
                {/* Category badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-secondary-container text-on-secondary-container font-label-sm px-3 py-1 rounded-full shadow-sm">
                    {item.category || item.source || 'Article'}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-stack-md flex flex-col flex-1">
                <h3 className="font-headline-md text-headline-md text-primary mb-stack-sm line-clamp-2">
                  {item.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-stack-md flex-1">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between mt-auto pt-stack-sm border-t border-surface-variant">
                  <span className="font-label-sm text-outline">
                    {new Date(item.pubDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <a
                    href={`/article/${item.id}`}
                    className="font-label-md text-secondary hover:text-primary transition-colors flex items-center gap-1"
                  >
                    Read Article
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant gap-4">
          <span className="material-symbols-outlined text-[56px]">bookmark</span>
          <p className="font-body-lg">You haven't bookmarked any articles yet.</p>
          <a href="/" className="mt-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary/90 transition-colors">
            Browse Articles
          </a>
        </div>
      )}
    </div>
  );
}
