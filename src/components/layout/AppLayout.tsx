'use client';

import ThemeToggle from '@/components/common/ThemeToggle';
import { useUIStore } from '@/store/uiStore';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  return (
    <div className="bg-background relative h-screen w-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="relative h-screen w-screen overflow-hidden">
        {children}
      </main>

      <div className="fixed top-4 right-4 z-30">
        <ThemeToggle />
      </div>
    </div>
  );
}
