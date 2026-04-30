import React from 'react';
import { fetchUserStats, fetchUserPerformance } from '@/lib/data';
import { createClient } from '@/lib/server';
import Link from 'next/link';

export default async function TrackerPage() {
  const stats = await fetchUserStats();
  const performance = await fetchUserPerformance();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <h2 className="font-headline-xl text-indigo-950 mb-4">Please Sign In</h2>
        <p className="font-body-lg text-slate-500 mb-8 max-w-md">You need to be logged in to track your performance and study history.</p>
        <Link href="/" className="px-8 py-3 bg-primary text-white rounded-xl font-label-md">Go to Dashboard</Link>
      </div>
    );
  }

  const catEntries = Object.entries(performance?.categoryBreakdown || {});
  const maxCatVal = Math.max(...catEntries.map(([_, val]) => val as number), 1);

  return (
    <div className="flex-1 overflow-y-auto px-gutter py-margin-page bg-slate-50/50">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h2 className="font-headline-xl text-indigo-950 mb-2">Study Tracker</h2>
          <p className="font-body-lg text-slate-500">Your personal roadmap to mastering current affairs.</p>
        </header>

        {/* Top Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              </div>
              <h3 className="font-label-md text-slate-400 uppercase tracking-widest">Total XP</h3>
            </div>
            <p className="font-display-lg text-indigo-950">{stats?.totalXp || 0}</p>
            <p className="text-[12px] text-slate-400 mt-2 font-medium">Top 5% of Aspirants this week</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
              </div>
              <h3 className="font-label-md text-slate-400 uppercase tracking-widest">Quiz Accuracy</h3>
            </div>
            <p className="font-display-lg text-indigo-950">{performance?.quizAccuracy || 0}%</p>
            <p className="text-[12px] text-slate-400 mt-2 font-medium">Based on {performance?.totalQuizzes || 0} attempts</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              </div>
              <h3 className="font-label-md text-slate-400 uppercase tracking-widest">Best Streak</h3>
            </div>
            <p className="font-display-lg text-indigo-950">{stats?.streakCount || 0} Days</p>
            <p className="text-[12px] text-slate-400 mt-2 font-medium">Keep it up! Don't break the chain.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Mastery */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-headline-md text-indigo-950 mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">pie_chart</span>
              Category Mastery
            </h3>
            <div className="space-y-6">
              {catEntries.length > 0 ? catEntries.map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-label-md text-slate-700">{cat}</span>
                    <span className="font-label-sm text-slate-400">{count} Briefings</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${((count as number) / maxCatVal) * 100}%` }}
                    />
                  </div>
                </div>
              )) : (
                <p className="text-slate-400 italic">No reading history yet.</p>
              )}
            </div>
          </section>

          {/* Activity Timeline */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-headline-md text-indigo-950 mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">timeline</span>
              Weekly Momentum
            </h3>
            <div className="flex items-end justify-between h-48 gap-2 pb-2 border-b border-slate-100">
              {[60, 40, 80, 50, 90, 70, 45].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group">
                  <div 
                    className="w-full bg-indigo-50 rounded-t-lg group-hover:bg-primary/20 transition-all cursor-pointer relative" 
                    style={{ height: `${val}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-950 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {val} pts
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <span key={day} className="font-label-sm text-slate-400">{day}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
