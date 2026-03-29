'use client';

import { ZOOM_STEP } from '@/constants/canvas';
import { Minus, Plus } from 'lucide-react';

interface Props {
  zoom: number;
  zoomBy: (delta: number, cx: number, cy: number) => void;
}

export default function ZoomControls({ zoom, zoomBy }: Props) {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  return (
    <div className="border-border bg-card fixed right-[18px] bottom-[22px] z-20 flex items-center gap-0.5 rounded-[12px] border p-[3px] shadow-md">
      <button
        className="hover:bg-primary/15 flex h-[26px] w-[32px] items-center justify-center rounded-[8px]"
        onClick={() => zoomBy(-ZOOM_STEP, cx, cy)}
      >
        <Minus size={14} />
      </button>
      <span className="text-muted-foreground hover:text-foreground min-w-9 cursor-pointer px-1.5 text-center text-[11px]">
        {Math.round(zoom * 100)}%
      </span>
      <button
        className="hover:bg-primary/15 flex h-[26px] w-[26px] items-center justify-center rounded-[8px]"
        onClick={() => zoomBy(+ZOOM_STEP, cx, cy)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
