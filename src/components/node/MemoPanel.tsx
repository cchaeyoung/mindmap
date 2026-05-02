'use client';

import { NODE_COLORS_DARK, NODE_COLORS_LIGHT } from '@/constants/node';
import { useMapStore } from '@/store/mapStore';
import { useUIStore } from '@/store/uiStore';
import IconButton from '@/components/common/IconButton';
import { FileText, Trash2, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

interface Props {
  nodeId: string;
}

export default function MemoPanel({ nodeId }: Props) {
  const node = useMapStore((state) => state.nodes.find((n) => n.id === nodeId));
  const updateNode = useMapStore((state) => state.updateNode);
  const setMemoPanelNode = useUIStore((state) => state.setMemoPanelNode);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const palette = isDark ? NODE_COLORS_DARK : NODE_COLORS_LIGHT;
  const selectedNodeId = useUIStore((state) => state.selectedNodeId);
  const [visible, setVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setMemoPanelNode(null), 300);
  };

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    setTimeout(() => textareaRef.current?.focus(), 320);
  }, []);

  useEffect(() => {
    if (selectedNodeId === nodeId) return;
    const t1 = setTimeout(() => setVisible(false), 0);
    const t2 = setTimeout(() => setMemoPanelNode(null), 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [selectedNodeId, nodeId, setMemoPanelNode]);

  if (!node) return null;

  const iconColor = palette[node.colorIndex] ?? 'var(--acc-fg)';
  const hasMemo = !!(node.memo && node.memo.trim());

  return (
    <div
      className={`border-border bg-popover fixed right-4.5 bottom-17.5 z-30 flex h-100 w-77.5 flex-col overflow-hidden rounded-[18px] border shadow-[0_12px_48px_var(--mm-shadow)] backdrop-blur-[28px] transition-all duration-300 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-[calc(100%+28px)] opacity-0'
      }`}
    >
      <div className="border-border flex shrink-0 items-center justify-between border-b px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-[6px]">
            <FileText size={15} style={{ color: iconColor }} />
          </div>
          <span className="text-foreground truncate text-[14px] font-semibold">
            {node.label || '제목 없음'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {hasMemo && (
            <>
              <IconButton
                title="메모 삭제"
                onClick={() => updateNode(nodeId, { memo: '' })}
                className="h-6.5 w-6.5 rounded-[7px] hover:bg-[rgba(239,68,68,0.1)] hover:text-[#ef4444]"
              >
                <Trash2 size={13} />
              </IconButton>
              <div className="bg-border mx-0.5 h-3.5 w-px" />
            </>
          )}
          <IconButton title="닫기" onClick={handleClose} className="h-7 w-7 rounded-[8px]">
            <X size={15} />
          </IconButton>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 pt-3.5">
        <textarea
          ref={textareaRef}
          value={node.memo ?? ''}
          onChange={(e) => updateNode(nodeId, { memo: e.target.value })}
          placeholder="메모를 입력하세요..."
          className="text-foreground placeholder:text-muted-foreground flex-1 resize-none bg-transparent text-[13.5px] leading-[1.8] outline-none"
        />
      </div>
    </div>
  );
}
