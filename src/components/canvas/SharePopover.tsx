'use client';

import { Check, Copy, Globe, Link2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface Props {
  open: boolean;
  isPublic: boolean;
  isPending: boolean;
  onToggle: (value: boolean) => void;
  onCopyLink: () => void;
  mapId: string;
}

export default function SharePopover({
  open,
  isPublic,
  isPending,
  onToggle,
  onCopyLink,
  mapId,
}: Props) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${mapId}`;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = () => {
    onCopyLink();
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 60,
        right: 60,
        transform: `translateY(${open ? 0 : -6}px) scale(${open ? 1 : 0.97})`,
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: 'opacity 0.15s, transform 0.22s cubic-bezier(0.22,1,0.36,1)',
        zIndex: 100,
        width: 288,
        transformOrigin: 'top right',
      }}
    >
      <div className="bg-popover border-border flex flex-col overflow-hidden rounded-[18px] border shadow-[0_8px_32px_var(--mm-shadow)]">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-200',
              isPublic ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
            )}
          >
            {isPublic ? <Globe size={13} /> : <Lock size={13} />}
          </div>
          <div className="flex-1">
            <p className="text-foreground text-[12.5px] font-medium">링크 공유</p>
            <p className="text-muted-foreground text-[11px]">
              {isPublic ? '링크가 있는 누구나 볼 수 있어요' : '현재 비공개 상태예요'}
            </p>
          </div>
          <Switch checked={isPublic} onCheckedChange={onToggle} disabled={isPending} size="lg" />
        </div>

        <div
          className={cn(
            'flex flex-col gap-2 overflow-hidden transition-all duration-200',
            isPublic ? 'max-h-40 px-4 pb-4' : 'max-h-0'
          )}
        >
          <div className="border-border bg-muted/40 flex items-center gap-2 rounded-[10px] border py-2 pr-2 pl-3">
            <span className="text-muted-foreground min-w-0 flex-1 truncate text-[11.5px]">
              {shareUrl}
            </span>
            <button
              onClick={handleCopy}
              className={cn(
                'flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-[6px] transition-colors',
                copied ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              'flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] text-[12.5px] font-medium transition-all',
              copied
                ? 'bg-primary/10 text-primary'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
          >
            {copied ? (
              <>
                <Check size={13} />
                복사됐어요
              </>
            ) : (
              <>
                <Link2 size={13} />
                링크 복사
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
