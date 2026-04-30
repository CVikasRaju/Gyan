import { fetchDailyDigest, fetchUserStats } from '@/lib/data';
import { createClient } from '@/lib/server';
import Link from 'next/link';

export const revalidate = 60;

const CATEGORIES = ['All Briefings', 'Geopolitics', 'Macroeconomics', 'Science & Tech', 'Environment'];

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: searchQuery } = await searchParams;
  const digestItems = await fetchDailyDigest(searchQuery);
  const userStats = await fetchUserStats();
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Aspirant';

  const featured = digestItems[0] ?? null;
  const rest = digestItems.slice(1);

  // Goal Progress Calculation
  const articlesRead = userStats?.articlesReadToday || 0;
  const dailyGoal = userStats?.dailyGoal || 5;
  const goalPercent = Math.min((articlesRead / dailyGoal) * 100, 100);

  return (
    /* Two-column desktop layout: News Feed | Right Widgets */
    <div className="flex flex-1 h-full overflow-hidden">

      {/* ── CENTER: News Feed ── */}
      <main className="flex-1 overflow-y-auto px-gutter py-margin-page">

        {/* Header */}
        <header className="mb-stack-lg">
          <h2 className="font-headline-xl text-headline-xl text-on-background mb-stack-sm">
            Good morning, {userName}.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Here is your customised daily briefing for comprehensive analysis.
          </p>
        </header>

        {/* Search Bar */}
        <div className="relative mb-stack-lg">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <form action="/">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search briefings, analysis, or topics..."
              className="w-full pl-12 pr-4 py-3.5 bg-surface-container rounded-2xl border border-outline-variant/30 font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </form>
        </div>


        {/* Category Filter Chips */}
        <div className="flex gap-3 mb-stack-lg overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat}
              href={i === 0 ? '/' : `/category/${cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
              className={`px-4 py-2 rounded-full font-label-md whitespace-nowrap transition-colors ${
                i === 0
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>


        {/* News Feed */}
        <div className="flex flex-col gap-stack-lg">

          {/* Featured Card */}
          {featured && (
            <article className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
              <div className="relative h-56 w-full bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30">article</span>
                <div className="absolute top-4 left-4">
                  <span className="bg-surface/90 backdrop-blur-sm text-primary font-label-sm px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                    {featured.category || featured.source || 'Briefing'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-on-surface-variant font-label-sm">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>10 min read</span>
                  <span className="mx-1">•</span>
                  <span>{new Date(featured.pubDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-on-surface mb-3 group-hover:text-primary transition-colors">
                  {featured.title}
                </h3>
                <p className="font-body-md text-on-surface-variant line-clamp-2">{featured.summary}</p>
              </div>
            </article>
          )}

          {/* Standard grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-stack-md">
              {rest.map((item) => (
                <DigestCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {digestItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-4">newspaper</span>
              <p className="font-body-md">No articles found right now.</p>
            </div>
          )}
        </div>
      </main>

      {/* ── RIGHT: Widgets ── */}
      <aside className="w-80 lg:w-[340px] bg-surface-bright border-l border-outline-variant/30 p-gutter overflow-y-auto hidden lg:flex flex-col gap-stack-lg">

        <section className="bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant/20 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-label-md text-on-surface uppercase tracking-wider">Daily Goal</h3>
            <span className="material-symbols-outlined text-outline">track_changes</span>
          </div>
          <div className="flex items-end gap-2 mb-3">
            <span className="font-display-lg text-primary">{articlesRead}</span>
            <span className="font-body-md text-on-surface-variant mb-2">/ {dailyGoal} Articles Read</span>
          </div>
          <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${goalPercent}%` }} />
          </div>
          <p className="font-label-sm text-on-surface-variant mt-3 text-center">
            {goalPercent >= 100 ? "Goal reached! Excellent discipline." : "Consistent reading builds deep knowledge."}
          </p>
        </section>

        <section className="bg-gradient-to-br from-primary-container to-tertiary-container rounded-xl shadow-sm p-6 text-on-primary relative overflow-hidden">
          <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[120px] opacity-10">local_fire_department</span>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <span className="material-symbols-outlined text-white">local_fire_department</span>
            </div>
            <h3 className="font-label-md text-primary-fixed uppercase tracking-wider">Current Streak</h3>
          </div>
          <div className="font-display-lg text-white mb-1">{userStats?.streakCount || 0} Days</div>
          <p className="font-body-md text-primary-fixed-dim">You're building exceptional discipline. Keep the momentum going tomorrow.</p>
        </section>

        <section className="bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant/20 p-5 text-center flex flex-col items-center">
          <div className="w-14 h-14 bg-tertiary-fixed rounded-full flex items-center justify-center mb-4 text-on-tertiary-fixed">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
          </div>
          <h3 className="font-headline-md text-on-surface mb-2">Quiz</h3>
          <p className="font-body-md text-on-surface-variant mb-5">Test your retention on today's core topics to reinforce learning.</p>
          <Link 
            href="/quiz"
            className="w-full py-3 bg-secondary text-on-secondary rounded-lg font-label-md hover:bg-secondary/90 transition-colors shadow-sm flex justify-center items-center gap-2"
          >
            Start Quick Quiz
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </section>

      </aside>
    </div>
  );
}
