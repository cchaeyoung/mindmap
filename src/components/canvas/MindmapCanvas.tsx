'use client';

import { Stage, Layer } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useRef, useState } from 'react';
import { useMapStore } from '@/store/mapStore';
import MindmapNode from '@/components/node/MindmapNode';
interface Props {
  cam: { x: number; y: number; zoom: number };
  onWheel: (e: KonvaEventObject<WheelEvent>) => void;
  onMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseUp: () => void;
}

const getDepth = (nodeId: string, nodes: { id: string; parentId: string | null }[]): number => {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node || !node.parentId) return 0;
  return 1 + getDepth(node.parentId, nodes);
};

export default function MindMapCanvas({
  cam,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const nodes = useMapStore((state) => state.nodes);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      <Stage
        width={size.width}
        height={size.height}
        x={cam.x}
        y={cam.y}
        scaleX={cam.zoom}
        scaleY={cam.zoom}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <Layer>
          {nodes.map((node) => (
            <MindmapNode
              key={node.id}
              node={node}
              isSelected={false}
              depth={getDepth(node.id, nodes)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
