"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

interface SidebarProps {
  isDrawerOpen?: boolean;
  closeDrawer?: () => void;
}

const navItems = [
  { label: 'Dashboard',       icon: 'dashboard',    href: '/'         },
  { label: 'Quiz',            icon: 'quiz',         href: '/quiz'     },
  { label: 'Bookmarks',       icon: 'bookmark',     href: '/bookmarks' },
  { label: 'Study Tracker',   icon: 'event_note',   href: '/tracker'  },
  { label: 'Account',         icon: 'person',       href: '/account'  },
  { label: 'Pricing',         icon: 'payments',     href: '/pricing'  },
];


export function Sidebar({ isDrawerOpen, closeDrawer }: SidebarProps) {
  const pathname = usePathname();
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  const username = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const drawerClass = isDrawerOpen !== undefined
    ? `${isDrawerOpen ? 'translate-x-0 shadow-2xl shadow-indigo-900/10' : '-translate-x-full'} md:translate-x-0`
    : 'translate-x-0';

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-72 flex flex-col z-50
        bg-slate-50 text-indigo-900 font-['Plus_Jakarta_Sans'] text-sm antialiased
        transition-transform duration-300 border-r border-slate-200 ${drawerClass}`}
    >
      {/* Header with Logo */}
      <div className="p-6 pb-2">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-14 h-14 relative flex items-center justify-center rounded-2xl bg-indigo-950 shadow-lg overflow-hidden">
            <Image 
              src="/logo.png" 
              alt="GYAN Logo" 
              fill
              className="object-contain z-10"
              priority
              onError={(e) => {
                // Fallback to hidden if image fails
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Fallback SVG Icon if image is missing */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-white">
              <span className="material-symbols-outlined text-[32px] leading-none mb-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              <span className="text-[10px] font-black tracking-tighter leading-none">GYAN</span>
            </div>
          </div>
          <div className="flex flex-col group-hover:translate-x-0.5 transition-transform">
            <h1 className="text-xl font-black text-indigo-950 leading-none tracking-tight">GYAN</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Current Affairs AI</p>
          </div>
        </Link>
      </div>

      {/* User Section */}
      {user ? (
        <div className="px-6 py-4 flex items-center gap-4 border-y border-slate-200/60 bg-white/50">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center border border-indigo-100 shrink-0">
            <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </div>
          <div className="flex flex-col min-w-0">
            <p className="font-h3 text-sm text-primary leading-tight truncate">
              {username}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">UPSC Journey</p>
          </div>
        </div>
      ) : (
        <div className="px-6 py-4 border-y border-slate-200/60 bg-white/50">
          <button 
            onClick={() => signInWithGoogle()}
            className="w-full py-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm font-label-md text-indigo-900"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      )}

      {/* CTA */}
      <div className="px-4 pt-6 pb-2">
        <button className="w-full bg-primary hover:bg-primary/90 text-white font-label-md py-3 px-4 rounded-xl shadow-sm transition-all flex justify-center items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">play_circle</span>
          Start Daily Test
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeDrawer}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary text-on-primary shadow-ambient scale-[1.02]' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] ${
                isActive ? 'text-on-primary' : 'text-on-surface-variant group-hover:text-primary'
              }`}>
                {item.icon}
              </span>
              <span className="font-label-lg">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-on-primary" />
              )}
            </Link>
          );
        })}

        {/* Conditional Admin Link */}
        {(user?.user_metadata?.role === 'admin' || user?.email?.endsWith('@gyan.ai')) && (
          <Link
            href="/admin"
            onClick={closeDrawer}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
              pathname === '/admin'
                ? 'bg-amber-600 text-white shadow-ambient'
                : 'text-amber-700/70 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
            <span className="font-label-lg">Editorial Dashboard</span>
          </Link>
        )}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-slate-200/60 px-2 py-4 flex flex-col gap-1">
        <Link
          href="/help"
          onClick={closeDrawer}
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-white/60 hover:text-indigo-700 transition-all rounded-xl"
        >
          <span className="material-symbols-outlined text-lg">help</span>
          <span className="font-body-md">Help Center</span>
        </Link>
        {user && (
          <button
            onClick={() => { signOut?.(); closeDrawer?.(); }}
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-white/60 hover:text-red-600 transition-all rounded-xl w-full text-left"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span className="font-body-md">Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}
