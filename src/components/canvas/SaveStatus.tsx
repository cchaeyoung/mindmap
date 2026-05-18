'use client';

import { Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type SaveStatus = 'idle' | 'saved' | 'error';

interface SaveStatusProps {
  status: SaveStatus;
  sidebarOpen: boolean;
}

export default function SaveStatus({ status, sidebarOpen }: SaveStatusProps) {
  if (status === 'idle') return null;

  return (
    <div
      className={cn(
        'text-muted-foreground animate-in fade-in fixed bottom-6 flex items-center gap-1 text-[11px] transition-all duration-300',
        sidebarOpen ? 'left-64' : 'left-4',
        status === 'error' ? 'text-destructive' : 'opacity-50'
      )}
    >
      {status === 'saved' && <Check size={11} />}
      {status === 'error' && <AlertCircle size={11} />}
      {status === 'saved' ? '저장됨' : '저장 실패'}
    </div>
  );
}
