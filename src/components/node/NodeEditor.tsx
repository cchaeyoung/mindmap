'use client';

import { NODE_STYLE } from '@/constants/node';
import { useCanvasStore } from '@/store/canvasStore';
import { useMapStore } from '@/store/mapStore';
import { useUIStore } from '@/store/uiStore';
import { useEffect, useRef } from 'react';

interface Props {
  nodeId: string;
  depth: number;
}

export default function NodeEditor({ nodeId, depth }: Props) {
  const cam = useCanvasStore((state) => state.cam);
  const node = useMapStore((state) => state.nodes.find((n) => n.id === nodeId));
  const updateNode = useMapStore((state) => state.updateNode);
  const setEditingNode = useUIStore((state) => state.setEditingNode);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  if (!node) return null;

  const tier = node.parentId === null ? 'root' : depth === 1 ? 'child' : 'sub';
  const style = NODE_STYLE[tier];
  const width = style.paddingX * 2 + 120;
  const height = style.fontSize * 1.4 + style.paddingY * 2;

  const screenX = node.x * cam.zoom + cam.x;
  const screenY = node.y * cam.zoom + cam.y;

  const finish = (label: string) => {
    updateNode(node.id, { label });
    setEditingNode(null);
  };

  return (
    <input
      ref={inputRef}
      defaultValue={node.label}
      onBlur={(e) => finish(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') finish(e.currentTarget.value);
      }}
      style={{
        position: 'absolute',
        left: screenX - (width * cam.zoom) / 2,
        top: screenY - (height * cam.zoom) / 2,
        width: width * cam.zoom,
        height: height * cam.zoom,
        fontSize: style.fontSize * cam.zoom,
        fontWeight: style.fontWeight,
        textAlign: 'center',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: 'rgba(255,255,255,0.95)',
        padding: 0,
        cursor: 'text',
      }}
    />
  );
}
