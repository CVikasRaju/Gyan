"use client";

import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[40px] text-slate-400">lock</span>
        </div>
        <h2 className="font-headline-xl text-on-background mb-4">Please Sign In</h2>
        <p className="font-body-lg text-on-surface-variant mb-8 max-w-md">
          You need to be logged in to view your account details and manage your subscription.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-primary text-white rounded-xl font-label-md hover:bg-primary/90 transition-all shadow-sm"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const userDetails = {
    name: user.user_metadata?.full_name || 'Not provided',
    email: user.email || 'Not provided',
    phone: user.phone || 'Not provided',
    plan: user.user_metadata?.plan || 'Free Tier',
    joined: new Date(user.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })
  };

  return (
    <div className="flex-1 overflow-y-auto px-gutter py-margin-page bg-slate-50/50">
      <div className="max-w-2xl mx-auto">
        <header className="mb-stack-lg">
          <h2 className="font-headline-xl text-on-background mb-2">My Account</h2>
          <p className="font-body-lg text-on-surface-variant">Manage your personal information and subscription plan.</p>
        </header>

        <div className="space-y-stack-md">
          {/* Personal Info Card */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-label-md text-primary uppercase tracking-wider">Personal Information</h3>
              <span className="material-symbols-outlined text-slate-400">badge</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                  <p className="font-body-lg text-indigo-950 font-semibold">{userDetails.name}</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                  <p className="font-body-lg text-indigo-950 font-semibold">{userDetails.email}</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                  <p className="font-body-lg text-indigo-950 font-semibold">{userDetails.phone}</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Member Since</label>
                  <p className="font-body-lg text-indigo-950 font-semibold">{userDetails.joined}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Subscription Card */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-label-md text-primary uppercase tracking-wider">Subscription Plan</h3>
              <span className="material-symbols-outlined text-slate-400">payments</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary-container/10 border border-primary-container/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[28px]">verified_user</span>
                  </div>
                  <div>
                    <p className="font-label-md text-primary">{userDetails.plan}</p>
                    <p className="text-[12px] text-slate-500">Billed monthly • Active</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-primary font-label-md hover:bg-primary-container/20 rounded-lg transition-colors">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </section>

          {/* Security & Settings Card */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-label-md text-primary uppercase tracking-wider">Security & Actions</h3>
              <span className="material-symbols-outlined text-slate-400">settings</span>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <button className="w-full py-3 px-4 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400">lock_reset</span>
                  <span className="font-body-md text-indigo-950">Change Password</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>
              
              <button 
                onClick={() => signOut()}
                className="w-full py-4 px-4 rounded-xl bg-red-50 text-red-600 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors font-label-md shadow-sm mt-4"
              >
                <span className="material-symbols-outlined">logout</span>
                Log Out of All Devices
              </button>
            </div>
          </section>

          <p className="text-center text-[12px] text-slate-400 py-6 font-medium uppercase tracking-widest">
            GYAN • Privacy Policy • Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
