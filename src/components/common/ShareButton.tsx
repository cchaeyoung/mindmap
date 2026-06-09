'use client';

import { useEffect, useRef, useState } from 'react';
import { Share2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useShareMap } from '@/hooks/useShareMap';
import SharePopover from '@/components/canvas/SharePopover';
import { cn } from '@/lib/utils';

export default function ShareButton() {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const mapId = params.id as string;
  const { isPublic, toggle, copyLink, isPending } = useShareMap();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        !popoverRef.current?.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open]);

  if (!mapId) return null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'border-border bg-card flex h-9 cursor-pointer items-center gap-1.5 rounded-[12px] border px-3 text-[13px] font-medium shadow-[0_2px_14px_var(--mm-shadow)] backdrop-blur-[28px] transition-all',
          open
            ? 'border-primary/30 bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )}
      >
        <Share2 size={14} />
        공유
      </button>
      <div ref={popoverRef}>
        <SharePopover
          open={open}
          isPublic={isPublic}
          isPending={isPending}
          onToggle={toggle}
          onCopyLink={copyLink}
          mapId={mapId}
        />
      </div>
    </>
  );
}
