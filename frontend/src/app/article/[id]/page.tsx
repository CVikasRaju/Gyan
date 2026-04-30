import { fetchDigestById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ReadTracker } from '@/components/feed/ReadTracker';

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  const article = await fetchDigestById(decodedId);

  if (!article) {
    notFound();
  }

  const formattedDate = new Date(article.pubDate).toLocaleDateString([], { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-full bg-background">
      <ReadTracker digestId={decodedId} />
      <main className="max-w-[800px] mx-auto px-gutter py-margin-page">
        
        {/* Navigation / Back link */}
        <nav className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-md"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Briefings
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed font-label-sm rounded-full uppercase tracking-wider">
              {article.category || article.source}
            </span>
            <span className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label-sm rounded-full uppercase tracking-wider">
              {article.qaStatus || 'Verified'}
            </span>
          </div>
          
          <h1 className="font-display-lg text-on-surface leading-tight mb-6">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-4 text-on-surface-variant font-body-md border-b border-outline-variant pb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              {formattedDate}
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">history</span>
              5 min read
            </div>
            <div className="flex items-center gap-2 font-bold text-primary">
              <span className="material-symbols-outlined text-[18px]">source</span>
              {article.source}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-slate max-w-none">
          <p className="font-body-xl text-on-surface leading-relaxed mb-8 first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left">
            {article.summary}
          </p>
          
          <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/30 my-10">
            <h4 className="font-headline-md text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">lightbulb</span>
              Key Analysis
            </h4>
            <p className="font-body-md text-on-surface-variant">
              This briefing summarizes the core implications for current affairs analysis. For a full historical perspective and related datasets, please refer to the original source.
            </p>
          </div>
        </div>

        {/* Footer / Source */}
        <footer className="mt-12 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1">
            <p className="font-label-sm text-outline uppercase tracking-widest">Original Source</p>
            <p className="font-body-lg text-on-surface font-bold">{article.source}</p>
          </div>
          <a 
            href={article.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-secondary text-on-secondary rounded-xl font-label-md flex items-center gap-2 hover:bg-secondary/90 transition-all shadow-sm"
          >
            Visit Original Source
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          </a>
        </footer>
      </main>
    </div>
  );
}
