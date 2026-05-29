'use client';

import { Wand2, X } from 'lucide-react';
import { useState } from 'react';
import { SIDEBAR_EASE, SIDEBAR_OFFSET } from '@/constants/layout';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (topic: string) => void;
  anchorX: number;
  sidebarOpen: boolean;
}

const MAX_LENGTH = 200;

export default function AiGeneratePopover({
  open,
  onClose,
  onSubmit,
  anchorX,
  sidebarOpen,
}: Props) {
  const [topic, setTopic] = useState('');

  const handleSubmit = () => {
    if (!topic.trim()) return;
    onSubmit(topic.trim());
    setTopic('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 80,
        left: anchorX,
        marginLeft: sidebarOpen ? SIDEBAR_OFFSET : 0,
        transform: `translateX(-50%) translateY(${open ? 0 : 12}px)`,
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: `margin-left 280ms ${SIDEBAR_EASE}, opacity 0.2s, transform 0.28s cubic-bezier(0.22,1,0.36,1)`,
        zIndex: 100,
        width: 348,
      }}
    >
      <div className="bg-popover border-border relative flex flex-col gap-3.5 rounded-[20px] border p-5 shadow-[0_20px_64px_var(--mm-shadow)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Wand2 size={13} className="text-primary" />
            <span className="text-foreground text-[13.5px] font-semibold tracking-[-0.2px]">
              AI 마인드맵 생성
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-[12px]">
            주제를 입력하면 AI가 마인드맵을 자동으로 생성합니다
          </p>
          <div className="border-border bg-accent/50 focus-within:border-primary/35 flex flex-col rounded-[12px] border transition-[border-color]">
            <textarea
              placeholder="마인드맵 주제를 입력하세요"
              value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, MAX_LENGTH))}
              autoFocus
              rows={2}
              className="placeholder:text-muted-foreground/60 w-full resize-none bg-transparent px-3.5 pt-3 pb-1 text-[13px] leading-[1.7] outline-none"
            />
            <div className="flex justify-end px-3.5 pb-2.5">
              <span
                className={`text-[11px] tabular-nums ${topic.length >= MAX_LENGTH ? 'text-destructive' : 'text-muted-foreground/40'}`}
              >
                {topic.length}/{MAX_LENGTH}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!topic.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex h-9 w-full items-center justify-center rounded-[11px] text-[13px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
        >
          생성하기
        </button>
        <div className="border-border bg-popover absolute -bottom-1.25 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-r border-b" />
      </div>
    </div>
  );
}
