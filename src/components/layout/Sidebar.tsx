'use client';

import { LogOut, PanelLeftClose, PanelLeftOpen, Plus } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <>
      {!open && (
        <button
          onClick={onToggle}
          className="border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground fixed top-4.5 left-4.5 z-26 flex h-8.5 w-8.5 items-center justify-center rounded-[10px] border shadow-[0_2px_14px_var(--mm-shadow)] backdrop-blur-[28px] transition-all"
        >
          <PanelLeftOpen size={16} />
        </button>
      )}

      {/* 사이드바 */}
      <aside
        className="border-sidebar-border bg-sidebar fixed top-0 left-0 z-55 flex h-screen w-60 flex-col border-r transition-transform duration-280"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(-240px)',
          transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)',
        }}
      >
        {/* 헤더 */}
        <div className="border-sidebar-border flex shrink-0 items-center border-b px-3 pt-3.25 pb-2.75">
          <span className="text-foreground flex-1 text-[13px] font-semibold">mindmap</span>
          <button
            onClick={onToggle}
            className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all"
          >
            <PanelLeftClose size={16} />
          </button>
        </div>

        {/* 맵 목록 */}
        <div className="flex shrink-0 items-center justify-between py-3.5 pr-3 pl-4">
          <span className="text-muted-foreground text-[10px] font-semibold tracking-[0.7px]">
            내 마인드맵
          </span>
          <button className="text-muted-foreground hover:text-primary hover:bg-primary/15 flex h-5.5 w-5.5 items-center justify-center rounded-[6px] transition-all">
            <Plus size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-1 [&::-webkit-scrollbar]:hidden" />

        {/* 유저 영역 */}
        <div className="border-sidebar-border hover:bg-accent flex shrink-0 cursor-pointer items-center gap-2.5 border-t px-3.5 py-3 transition-all">
          <div className="border-primary/35 bg-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] text-[13px] font-semibold text-(--mm-acc-fg)">
            ?
          </div>
          <div className="flex-1">
            <div className="text-foreground text-[12px] font-medium">게스트</div>
            <div className="text-muted-foreground text-[10.5px]">로그인하기</div>
          </div>
          <button className="text-muted-foreground hover:bg-destructive/15 hidden h-6.5 w-6.5 shrink-0 items-center justify-center rounded-[7px] transition-all hover:text-red-400">
            <LogOut size={13} />
          </button>
        </div>
      </aside>
    </>
  );
}
