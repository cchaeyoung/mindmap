'use client';

import { Stage, Layer } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NODE_SIZE_SCALE, NODE_STYLE } from '@/constants/node';
import { measureNodeWidth } from '@/utils/node';
import { useMapStore } from '@/store/mapStore';
import { useCanvasStore } from '@/store/canvasStore';
import MindmapNode from '@/components/node/MindmapNode';
import NodeAddButton from '@/components/node/NodeAddButton';
import { useUIStore } from '@/store/uiStore';
import Edge from '@/components/canvas/Edge';
import { NodeRefsProvider } from '@/context/NodeRefsContext';
import NodeEditor from '../node/NodeEditor';
import NodePopup from '@/components/node/NodePopup';
import { cn } from '@/lib/utils';

interface Props {
  onWheel: (e: KonvaEventObject<WheelEvent>) => void;
  onMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseUp: () => void;
}

export default function MindMapCanvas({ onWheel, onMouseDown, onMouseMove, onMouseUp }: Props) {
  const cam = useCanvasStore((state) => state.cam);
  const setStageSize = useCanvasStore((state) => state.setStageSize);
  const selectedNodeId = useUIStore((state) => state.selectedNodeId);
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const editingNodeId = useUIStore((state) => state.editingNodeId);
  const setEditingNode = useUIStore((state) => state.setEditingNode);
  const isDragging = useUIStore((state) => state.isDragging);
  const canvasMode = useUIStore((state) => state.canvasMode);
  const setCanvasMode = useUIStore((state) => state.setCanvasMode);
  const hoveredNodeId = useUIStore((state) => state.hoveredNodeId);
  const setHoveredNode = useUIStore((state) => state.setHoveredNode);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const nodes = useMapStore((state) => state.nodes);
  const addNode = useMapStore((state) => state.addNode);
  const deleteNode = useMapStore((state) => state.deleteNode);
  const updateNode = useMapStore((state) => state.updateNode);

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

  const handleContainerMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging || e.buttons !== 0) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      for (const node of nodes) {
        const tier = node.parentId === null ? 'root' : 'child';
        const style = NODE_STYLE[tier];
        const scale = NODE_SIZE_SCALE[node.size ?? 'M'];
        const nodeH = style.fontSize * scale * 1.4 + style.paddingY * scale * 2;
        const screenCX = cam.x + node.x * cam.zoom;
        const screenCY = cam.y + node.y * cam.zoom;
        const screenW = node.width * cam.zoom;
        const screenH = nodeH * cam.zoom;

        const isHovered = node.id === hoveredNodeId;
        const leftPad = isHovered && (node.direction === 'left' || node.parentId === null) ? 50 : 0;
        const rightPad = isHovered && (node.direction !== 'left' || node.parentId === null) ? 50 : 0;

        if (
          mouseX >= screenCX - screenW / 2 - leftPad &&
          mouseX <= screenCX + screenW / 2 + rightPad &&
          mouseY >= screenCY - screenH / 2 &&
          mouseY <= screenCY + screenH / 2
        ) {
          if (node.id !== hoveredNodeId) setHoveredNode(node.id);
          return;
        }
      }
      if (hoveredNodeId !== null) setHoveredNode(null);
    },
    [nodes, cam, setHoveredNode, hoveredNodeId, isDragging]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      deleteNode(nodeId);
      setSelectedNode(node?.parentId ?? null);
    },
    [nodes, deleteNode, setSelectedNode]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId && !editingNodeId) {
        handleDeleteNode(selectedNodeId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, editingNodeId, handleDeleteNode]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  const handleAddChild = (direction: 'left' | 'right') => {
    const targetNode = selectedNode ?? nodes.find((n) => n.id === hoveredNodeId) ?? null;
    if (!targetNode) return;
    if (canvasMode === 'hand') setCanvasMode('select');
    const children = nodes.filter((n) => n.parentId === targetNode.id);
    const newId = addNode({
      x: direction === 'right' ? targetNode.x + 200 : targetNode.x - 200,
      y: targetNode.y + children.length * 80,
      label: '',
      parentId: targetNode.id,
      colorIndex: targetNode.colorIndex,
      size: 'M',
      shape: targetNode.shape,
      direction,
    });
    setSelectedNode(newId);
    setEditingNode(newId);
  };

  const addButtonTargetNode = selectedNode ?? nodes.find((n) => n.id === hoveredNodeId) ?? null;
  const addButtonPositions = (() => {
    if (!addButtonTargetNode) return [];
    const isRoot = addButtonTargetNode.parentId === null;
    const rightEdge = addButtonTargetNode.x + addButtonTargetNode.width / 2;
    const leftEdge = addButtonTargetNode.x - addButtonTargetNode.width / 2;
    const y = cam.y + addButtonTargetNode.y * cam.zoom;

    if (isRoot) {
      return [
        { x: cam.x + rightEdge * cam.zoom + 21, y, direction: 'right' as const },
        { x: cam.x + leftEdge * cam.zoom - 21, y, direction: 'left' as const },
      ];
    }

    const dir = addButtonTargetNode.direction ?? 'right';
    const edgeX = dir === 'right' ? rightEdge : leftEdge;
    const offset = dir === 'right' ? 21 : -21;
    return [{ x: cam.x + edgeX * cam.zoom + offset, y, direction: dir }];
  })();

  const popupPos = (() => {
    if (!selectedNode) return null;
    const tier = selectedNode.parentId === null ? 'root' : 'child';
    const style = NODE_STYLE[tier];
    const scale = NODE_SIZE_SCALE[selectedNode.size ?? 'M'];
    const nodeHeight = style.fontSize * scale * 1.4 + style.paddingY * scale * 2;
    return {
      x: cam.x + selectedNode.x * cam.zoom,
      y: cam.y + (selectedNode.y - nodeHeight / 2) * cam.zoom - 12,
      yBelow: cam.y + (selectedNode.y + nodeHeight / 2) * cam.zoom + 12,
    };
  })();

  return (
    <NodeRefsProvider>
      <div
        ref={containerRef}
        className={cn(
          'h-full w-full outline-none',
          canvasMode === 'hand' ? 'cursor-grab active:cursor-grabbing' : ''
        )}
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
      >
        {addButtonPositions.map((pos) => (
          <NodeAddButton
            key={pos.direction}
            x={pos.x}
            y={pos.y}
            direction={pos.direction}
            onClick={() => handleAddChild(pos.direction)}
          />
        ))}
        {popupPos && selectedNode && !isDragging && (
          <NodePopup
            x={popupPos.x}
            y={popupPos.y}
            yBelow={popupPos.yBelow}
            nodeColorIndex={selectedNode.colorIndex}
            onEdit={() => setEditingNode(selectedNode.id)}
            onDelete={() => handleDeleteNode(selectedNode.id)}
            onColorChange={(colorIndex) => updateNode(selectedNode.id, { colorIndex })}
            currentSize={selectedNode.size ?? 'M'}
            onSizeChange={(sz) => {
              const tier = selectedNode.parentId === null ? 'root' : 'child';
              const width = measureNodeWidth(selectedNode.label, tier, sz);
              updateNode(selectedNode.id, { size: sz, width });
            }}
            currentShape={selectedNode.shape}
            onShapeChange={(shape) => updateNode(selectedNode.id, { shape })}
            currentTextColor={selectedNode.textColor}
            onTextColorChange={(color) => updateNode(selectedNode.id, { textColor: color ?? undefined })}
          />
        )}
        {editingNodeId && <NodeEditor nodeId={editingNodeId} />}
        <Stage
          width={size.width}
          height={size.height}
          x={cam.x}
          y={cam.y}
          scaleX={cam.zoom}
          scaleY={cam.zoom}
          onWheel={onWheel}
          onMouseDown={(e) => {
            if (e.evt.button === 0 && e.target === e.target.getStage() && canvasMode === 'select')
              setSelectedNode(null);
            if (canvasMode === 'hand') onMouseDown(e);
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
                isEditing={node.id === editingNodeId}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </NodeRefsProvider>
  );
}
