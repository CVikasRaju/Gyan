import React from 'react';
import { fetchFlaggedDigests, updateDigestStatus } from '@/lib/data';
import { createClient } from '@/lib/server';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Basic admin check (can be improved with roles)
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.email?.endsWith('@gyan.ai');

  if (!isAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <h2 className="font-headline-xl text-red-600 mb-4">Access Denied</h2>
        <p className="font-body-lg text-slate-500 mb-8 max-w-md">You do not have the required permissions to access the Editorial Dashboard.</p>
        <Link href="/" className="px-8 py-3 bg-primary text-white rounded-xl font-label-md">Return to Safety</Link>
      </div>
    );
  }

  const flagged = await fetchFlaggedDigests();

  async function approveAction(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;
    await updateDigestStatus(id, 'passed');
    revalidatePath('/admin');
    revalidatePath('/');
  }

  async function quarantineAction(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;
    await updateDigestStatus(id, 'quarantined');
    revalidatePath('/admin');
  }

  return (
    <div className="flex-1 overflow-y-auto px-gutter py-margin-page bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="font-headline-xl text-indigo-950 mb-2">Editorial Dashboard</h2>
            <p className="font-body-lg text-slate-500">Review and verify AI-generated content before publication.</p>
          </div>
          <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full border border-amber-200 font-label-md flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            {flagged.length} Items Pending Review
          </div>
        </header>

        <div className="space-y-6">
          {flagged.length > 0 ? flagged.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group">
              <div className="p-8 flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full font-label-sm uppercase tracking-wider ${
                      item.qaStatus === 'flagged' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {item.qaStatus}
                    </span>
                    <span className="text-slate-400 font-label-sm">•</span>
                    <span className="text-slate-400 font-label-sm uppercase tracking-widest">{item.category}</span>
                    <span className="text-slate-400 font-label-sm">•</span>
                    <span className="text-slate-400 font-label-sm">{item.source}</span>
                  </div>
                  <h3 className="font-headline-md text-indigo-950 mb-4">{item.title}</h3>
                  <p className="font-body-md text-slate-600 line-clamp-3 leading-relaxed mb-6">{item.summary}</p>
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary font-label-md flex items-center gap-1 hover:underline"
                  >
                    View Original Source
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                </div>

                <div className="lg:w-64 flex flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                  <form action={approveAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="w-full py-3 bg-green-600 text-white rounded-2xl font-label-md hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      Approve & Publish
                    </button>
                  </form>
                  <form action={quarantineAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-label-md hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">block</span>
                      Quarantine
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[40px]">task_alt</span>
              </div>
              <h3 className="font-headline-md text-indigo-950 mb-2">Queue is Empty</h3>
              <p className="font-body-lg text-slate-500">All summaries have been verified. Great job, Editor!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
