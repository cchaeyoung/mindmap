'use client';

import { useState } from 'react';
import ThemeToggle from '@/components/common/ThemeToggle';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="bg-background relative flex h-screen w-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
      <main
        className="relative flex-1 overflow-hidden transition-all duration-280"
        style={{ marginLeft: sidebarOpen ? '240px' : '0px' }}
      >
        {children}
      </main>

      <div className="fixed top-4 right-4 z-30">
        <ThemeToggle />
      </div>
    </div>
  );
}
