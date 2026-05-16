'use client';

import IconButton from '@/components/common/IconButton';
import { MindmapListItem } from '@/types';
import { formatDate } from '@/utils/date';
import { BrainCircuit, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
  map: MindmapListItem;
  isActive: boolean;
  isEditing: boolean;
  onClick: () => void;
  onRenameStart: () => void;
  onRename: (id: string, title: string) => void;
  onRenameCancel: () => void;
  onDelete: (id: string) => void;
}

export default function MindmapItem({
  map,
  isActive,
  isEditing,
  onClick,
  onRenameStart,
  onRename,
  onRenameCancel,
  onDelete,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [editValue, setEditValue] = useState(map.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);

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

  useEffect(() => {
    if (!isEditing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  return (
    <div
      onClick={onClick}
      className={`group relative mb-0.5 flex cursor-pointer items-center gap-2.5 rounded-[10px] px-2.5 py-2.25 transition-colors ${
        isActive || menuOpen ? 'bg-accent' : 'hover:bg-accent'
      }`}
    >
      <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]">
        <BrainCircuit size={15} className="text-primary" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex h-4.5 items-center">
          {isEditing ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onRename(map.id, editValue);
                if (e.key === 'Escape') {
                  cancelledRef.current = true;
                  onRenameCancel();
                }
              }}
              onBlur={() => {
                if (cancelledRef.current) {
                  cancelledRef.current = false;
                  return;
                }
                onRename(map.id, editValue);
              }}
              onClick={(e) => e.stopPropagation()}
              className="text-foreground w-full border-0 bg-transparent p-0 text-[12.5px] leading-none font-medium outline-none"
            />
          ) : (
            <div className="text-foreground truncate text-[12.5px] leading-none font-medium">
              {map.title}
            </div>
          )}
        </div>
        <div className="text-muted-foreground mt-px text-[10.5px]">
          {formatDate(map.updated_at)}
        </div>
      </div>

      <div ref={menuRef} className="relative">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            if (!menuOpen && menuRef.current) {
              const rect = menuRef.current.getBoundingClientRect();
              setDropUp(window.innerHeight - rect.bottom < 100);
            }
            setMenuOpen((v) => !v);
          }}
          className={`h-5.5 w-5.5 rounded-[6px] transition-opacity ${menuOpen ? 'bg-accent text-foreground opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <MoreHorizontal size={14} />
        </IconButton>

        {menuOpen && (
          <div
            className={`border-border absolute right-0 z-50 w-34 rounded-[10px] border bg-(--mm-menu) p-1 shadow-[0_8px_24px_var(--mm-shadow)] ${dropUp ? 'bottom-full mb-1' : 'top-full mt-1'}`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRenameStart();
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
