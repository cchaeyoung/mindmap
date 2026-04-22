import IconButton from '@/components/common/IconButton';
import { SIDEBAR_WIDTH } from '@/constants/layout';
import { NODE_COLORS } from '@/constants/node';
import { FileText, GitBranch, Pencil, Trash2 } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { useUIStore } from '@/store/uiStore';

interface Props {
  x: number;
  y: number;
  yBelow: number;
  nodeColor: string;
  onAddChild: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onColorChange: (color: string | null) => void;
}

export default function NodePopup({
  x,
  y,
  yBelow,
  nodeColor,
  onAddChild,
  onEdit,
  onDelete,
  onColorChange,
}: Props) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  useLayoutEffect(() => {
    if (!popupRef.current) return;
    const w = popupRef.current.offsetWidth;
    const vw = window.innerWidth;
    const leftBound = sidebarOpen ? SIDEBAR_WIDTH + 8 : 8;
    const newX = Math.min(Math.max(x, leftBound + w / 2), vw - w / 2 - 8);
    popupRef.current.style.left = `${newX}px`;
    const h = popupRef.current.offsetHeight;
    if (y - h < 8) {
      popupRef.current.style.top = `${yBelow}px`;
      popupRef.current.style.transform = 'translateX(-50%)';
    } else {
      popupRef.current.style.top = `${y}px`;
      popupRef.current.style.transform = 'translateX(-50%) translateY(-100%)';
    }
  }, [x, y, yBelow, sidebarOpen]);

  return (
    <div
      ref={popupRef}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        transform: 'translateX(-50%) translateY(-100%)',
        zIndex: 50,
      }}
      className="border-border bg-popover flex w-max flex-col overflow-hidden rounded-xl border shadow-[0_8px_32px_var(--mm-shadow)] backdrop-blur-[28px]"
    >
      {paletteOpen && (
        <div className="border-border flex flex-wrap items-center gap-1.25 border-b px-2.5 py-2">
          {NODE_COLORS.map((color, i) => (
            <button
              key={i}
              style={{ background: color ?? 'var(--foreground)' }}
              onClick={() => {
                onColorChange(color);
                setPaletteOpen(false);
              }}
              className="h-4 w-4 shrink-0 cursor-pointer rounded-full border-[1.5px] border-transparent transition-transform hover:scale-125"
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-0.5 px-2 py-1.25">
        <button
          style={{ background: nodeColor }}
          onClick={() => setPaletteOpen((v) => !v)}
          className="h-4.5 w-4.5 shrink-0 cursor-pointer rounded-full border-[2.5px] border-white/20 transition-all hover:scale-110 hover:border-white/55"
        />

        <div className="bg-border mx-1 h-4 w-px shrink-0" />

        <span className="text-muted-foreground pr-1 pl-0.5 text-[10px] tracking-[0.3px]">크기</span>
        {(['S', 'M', 'L'] as const).map((sz) => (
          <button
            key={sz}
            className="text-muted-foreground hover:bg-accent hover:text-foreground h-6.5 w-6.5 rounded-[7px] px-2.25 text-[11px] font-medium transition-all"
          >
            {sz}
          </button>
        ))}

        <div className="bg-border mx-1 h-4 w-px shrink-0" />

        <IconButton
          title="하위 항목 추가"
          onClick={onAddChild}
          className="h-6.5 w-6.5 rounded-[7px]"
        >
          <GitBranch size={12} />
        </IconButton>
        <IconButton title="편집" onClick={onEdit} className="h-6.5 w-6.5 rounded-[7px]">
          <Pencil size={12} />
        </IconButton>
        <IconButton title="메모" className="h-6.5 w-6.5 rounded-[7px]">
          <FileText size={12} />
        </IconButton>
        <IconButton
          title="삭제"
          onClick={onDelete}
          className="h-6.5 w-6.5 rounded-[7px] hover:bg-[rgba(248,113,113,0.1)] hover:text-[#f87171]"
        >
          <Trash2 size={12} />
        </IconButton>
      </div>
    </div>
  );
}
