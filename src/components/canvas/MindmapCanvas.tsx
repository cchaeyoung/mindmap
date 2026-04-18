'use client';

import { Stage, Layer } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useRef, useState } from 'react';
import { useMapStore } from '@/store/mapStore';
import { useCanvasStore } from '@/store/canvasStore';
import MindmapNode from '@/components/node/MindmapNode';
import NodeAddButton from '@/components/node/NodeAddButton';
import { useUIStore } from '@/store/uiStore';
import { NODE_STYLE } from '@/constants/node';
import Edge from '@/components/canvas/Edge';
import { NodeRefsProvider } from '@/context/NodeRefsContext';
import NodeEditor from '../node/NodeEditor';

interface Props {
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

export default function MindMapCanvas({ onWheel, onMouseDown, onMouseMove, onMouseUp }: Props) {
  const cam = useCanvasStore((state) => state.cam);
  const setStageSize = useCanvasStore((state) => state.setStageSize);
  const selectedNodeId = useUIStore((state) => state.selectedNodeId);
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const editingNodeId = useUIStore((state) => state.editingNodeId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const nodes = useMapStore((state) => state.nodes);
  const addNode = useMapStore((state) => state.addNode);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
      setStageSize({ width, height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;
  const handleAddChild = () => {
    if (!selectedNode) return;
    const children = nodes.filter((n) => n.parentId === selectedNode.id);
    const newId = addNode({
      x: selectedNode.x + 200,
      y: selectedNode.y + children.length * 80,
      label: '새 항목',
      parentId: selectedNode.id,
      color: selectedNode.color,
    });
    setSelectedNode(newId);
  };

  const addButtonPos = (() => {
    if (!selectedNode) return null;
    const depth = getDepth(selectedNode.id, nodes);
    const tier = selectedNode.parentId === null ? 'root' : depth === 1 ? 'child' : 'sub';
    const style = NODE_STYLE[tier];
    const nodeWidth = style.paddingX * 2 + 120;
    const rightEdge = selectedNode.x + nodeWidth / 2;
    return {
      x: cam.x + rightEdge * cam.zoom + 21,
      y: cam.y + selectedNode.y * cam.zoom,
    };
  })();

  return (
    <NodeRefsProvider>
      <div ref={containerRef} className="h-full w-full">
        {addButtonPos && (
          <NodeAddButton x={addButtonPos.x} y={addButtonPos.y} onClick={handleAddChild} />
        )}
        {editingNodeId &&
          (() => {
            const depth = getDepth(editingNodeId, nodes);
            return <NodeEditor nodeId={editingNodeId} depth={depth} />;
          })()}
        <Stage
          width={size.width}
          height={size.height}
          x={cam.x}
          y={cam.y}
          scaleX={cam.zoom}
          scaleY={cam.zoom}
          onWheel={onWheel}
          onMouseDown={(e) => {
            if (e.evt.button === 0 && e.target === e.target.getStage()) setSelectedNode(null);
            onMouseDown(e);
          }}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <Layer>
            {nodes
              .filter((node) => node.parentId !== null)
              .map((node) => {
                const parent = nodes.find((n) => n.id === node.parentId);
                if (!parent) return null;
                return <Edge key={node.id} fromNode={parent} toNode={node} />;
              })}
            {nodes.map((node) => (
              <MindmapNode
                key={node.id}
                node={node}
                isSelected={node.id === selectedNodeId}
                depth={getDepth(node.id, nodes)}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </NodeRefsProvider>
  );
}
