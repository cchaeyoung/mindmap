'use client';

import { NODE_SIZE_SCALE, NODE_STYLE } from '@/constants/node';
import { useCanvasStore } from '@/store/canvasStore';
import { useMapStore } from '@/store/mapStore';
import { useUIStore } from '@/store/uiStore';
import { measureNodeWidth } from '@/utils/node';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

interface Props {
  nodeId: string;
}

export default function NodeEditor({ nodeId }: Props) {
  const cam = useCanvasStore((state) => state.cam);
  const node = useMapStore((state) => state.nodes.find((n) => n.id === nodeId));
  const updateNode = useMapStore((state) => state.updateNode);
  const setEditingNode = useUIStore((state) => state.setEditingNode);
  const inputRef = useRef<HTMLInputElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  if (!node) return null;

  const isDark = resolvedTheme === 'dark';
  const textColor = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(14,12,42,0.92)';

  const tier = node.parentId === null ? 'root' : 'child';
  const style = NODE_STYLE[tier];
  const scale = NODE_SIZE_SCALE[node.size ?? 'M'];
  const height = style.fontSize * scale * 1.4 + style.paddingY * scale * 2;

  const screenX = node.x * cam.zoom + cam.x;
  const screenY = node.y * cam.zoom + cam.y;

  return (
    <input
      ref={inputRef}
      defaultValue={node.label}
      placeholder="새 항목"
      className="placeholder:text-black/30 dark:placeholder:text-white/30"
      onChange={(e) => {
        const newLabel = e.target.value;
        const newWidth = measureNodeWidth(newLabel, tier, node.size ?? 'M');
        updateNode(node.id, { label: newLabel, width: newWidth });
      }}
      onBlur={() => setEditingNode(null)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') setEditingNode(null);
      }}
      style={{
        position: 'absolute',
        left: screenX - (node.width * cam.zoom) / 2,
        top: screenY - (height * cam.zoom) / 2,
        width: node.width * cam.zoom,
        height: height * cam.zoom,
        fontSize: style.fontSize * scale * cam.zoom,
        fontWeight: style.fontWeight,
        textAlign: 'center',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: textColor,
        padding: 0,
        cursor: 'text',
        zIndex: 10,
      }}
    />
  );
}
