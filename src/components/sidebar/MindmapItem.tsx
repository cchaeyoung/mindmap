'use client';

import IconButton from '@/components/common/IconButton';
import { MindmapListItem } from '@/types';
import { formatDate } from '@/utils/date';
import { BrainCircuit, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
  map: MindmapListItem;
  isActive: boolean;
  onClick: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export default function MindmapItem({ map, isActive, onClick, onRename, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  return (
    <div
      onClick={onClick}
      className={`group relative mb-0.5 flex cursor-pointer items-center gap-2.5 rounded-[10px] px-2.5 py-2.25 transition-all ${
        isActive || menuOpen ? 'bg-accent' : 'hover:bg-accent'
      }`}
    >
      <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]">
        <BrainCircuit size={15} className="text-primary" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-foreground truncate text-[12.5px] font-medium">{map.title}</div>
        <div className="text-muted-foreground mt-px text-[10.5px]">
          {formatDate(map.updated_at)}
        </div>
      </div>

      <div ref={menuRef} className="relative">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
          className={`h-5.5 w-5.5 rounded-[6px] transition-opacity ${menuOpen ? 'bg-accent text-foreground opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <MoreHorizontal size={14} />
        </IconButton>

        {menuOpen && (
          <div className="border-border bg-card absolute top-full right-0 z-50 mt-1 w-34 rounded-[10px] border p-1 shadow-[0_8px_24px_var(--mm-shadow)] backdrop-blur-xl">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRename(map.id, map.title);
                setMenuOpen(false);
              }}
              className="hover:bg-accent text-foreground flex w-full cursor-pointer items-center gap-2 rounded-[7px] px-2.5 py-1.5 text-[12px]"
            >
              <Pencil size={12} className="text-muted-foreground" />
              이름 변경
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(map.id);
                setMenuOpen(false);
              }}
              className="flex w-full cursor-pointer items-center gap-2 rounded-[7px] px-2.5 py-1.5 text-[12px] text-red-400 hover:bg-red-400/10"
            >
              <Trash2 size={12} />
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
