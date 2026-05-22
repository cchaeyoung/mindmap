'use client';

import Image from 'next/image';
import { useMapStore } from '@/store/mapStore';
import { useUIStore } from '@/store/uiStore';

export default function EmptyCanvasHint() {
  const nodes = useMapStore((state) => state.nodes);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const isPlacing = useUIStore((s) => s.isPlacing);

  if (nodes.length > 0 || isPlacing) return null;

  return (
    <div
      style={{ paddingLeft: sidebarOpen ? 240 : 0, paddingBottom: 80 }}
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 transition-[padding] duration-[280ms]"
    >
      <Image
        src="/empty-mindmap.svg"
        alt=""
        width={280}
        height={135}
        style={{ marginLeft: '-9px' }}
        className="dark:opacity-75"
        unoptimized
      />
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-foreground text-[15px] font-semibold tracking-[-0.3px] opacity-50">
          마인드맵을 시작해보세요
        </p>
        <p className="text-muted-foreground flex items-center gap-1.5 text-[12px] opacity-70">
          하단
          <span className="bg-card border-border inline-flex h-4.5 w-4.5 items-center justify-center rounded-[5px] border text-[11px] leading-none font-medium">
            +
          </span>
          버튼으로 아이디어를 추가해보세요
        </p>
      </div>
    </div>
  );
}
