'use client';

import { useState } from 'react';
import ThemeToggle from '@/components/common/ThemeToggle';
import Sidebar from './Sidebar';
import Toolbar from '../canvas/Toolbar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="bg-background relative flex h-screen w-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
      <main className="relative h-screen w-screen overflow-hidden">
        {children}
      </main>

      <div className="fixed top-4 right-4 z-30">
        <ThemeToggle />
      </div>
      <Toolbar />
    </div>
  );
}
