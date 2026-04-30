"use client";

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';

export function NavigationLayout({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Sidebar isDrawerOpen={isDrawerOpen} closeDrawer={() => setIsDrawerOpen(false)} />
      <div className="flex-1 flex flex-col md:ml-72 h-screen overflow-hidden">
        <MobileHeader openDrawer={() => setIsDrawerOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      
      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-primary/40 backdrop-blur-[2px] z-40 transition-opacity md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
    </>
  );
}
