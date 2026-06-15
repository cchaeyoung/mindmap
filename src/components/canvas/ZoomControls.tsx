'use client';

import { ZOOM_STEP } from '@/constants/canvas';
import { useCanvasStore } from '@/store/canvasStore';
import { Minus, Plus } from 'lucide-react';

interface Props {
  zoomBy: (delta: number, cx: number, cy: number) => void;
}

export default function ZoomControls({ zoomBy }: Props) {
  const zoom = useCanvasStore((s) => s.displayZoom);

  return (
    <div className="border-border bg-card fixed right-4.5 bottom-5.5 z-20 flex items-center gap-0.5 rounded-[12px] border p-0.75 shadow-md">
      <button
        className="hover:bg-primary/15 flex h-6.5 w-8 items-center justify-center rounded-[8px]"
        onClick={() => zoomBy(-ZOOM_STEP, window.innerWidth / 2, window.innerHeight / 2)}
      >
        <Minus size={14} />
      </button>
      <span className="text-muted-foreground hover:text-foreground min-w-9 cursor-pointer px-1.5 text-center text-[11px]">
        {Math.round(zoom * 100)}%
      </span>
      <button
        className="hover:bg-primary/15 flex h-6.5 w-6.5 items-center justify-center rounded-[8px]"
        onClick={() => zoomBy(+ZOOM_STEP, window.innerWidth / 2, window.innerHeight / 2)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
