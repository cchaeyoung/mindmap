'use client';

import { Stage, Layer } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  NODE_DEFAULT_COLOR_INDEX,
  NODE_DEFAULT_SHAPE,
  NODE_SIZE_SCALE,
  NODE_STYLE,
} from '@/constants/node';
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
import MemoPanel from '@/components/node/MemoPanel';
import { cn } from '@/lib/utils';
import type { MindmapNode as MindmapNodeType } from '@/types';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

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
  const memoPanelNodeId = useUIStore((state) => state.memoPanelNodeId);
  const setMemoPanelNodeId = useUIStore((state) => state.setMemoPanelNode);
  const isPlacing = useUIStore((state) => state.isPlacing);
  const setIsPlacing = useUIStore((state) => state.setIsPlacing);
  const placingPos = useUIStore((state) => state.placingPos);
  const setPlacingPos = useUIStore((state) => state.setPlacingPos);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const nodes = useMapStore((state) => state.nodes);
  const addNode = useMapStore((state) => state.addNode);
  const deleteNode = useMapStore((state) => state.deleteNode);
  const updateNode = useMapStore((state) => state.updateNode);
  const applyAutoLayout = useMapStore((state) => state.applyAutoLayout);

  useEffect(() => {
    applyAutoLayout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, nodes.filter((n) => n.autoLayout).length]);

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
      if (isPlacing) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const worldX = (e.clientX - rect.left - cam.x) / cam.zoom;
        const worldY = (e.clientY - rect.top - cam.y) / cam.zoom;
        setPlacingPos({ x: worldX, y: worldY });
        return;
      }
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
        const hasPad = isHovered && node.id !== selectedNodeId;
        const leftPad = hasPad && (node.direction === 'left' || node.parentId === null) ? 50 : 0;
        const rightPad = hasPad && (node.direction !== 'left' || node.parentId === null) ? 50 : 0;

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
    [
      nodes,
      cam,
      setHoveredNode,
      hoveredNodeId,
      isDragging,
      selectedNodeId,
      isPlacing,
      setPlacingPos,
    ]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      deleteNode(nodeId);
      setSelectedNode(node?.parentId ?? null);
    },
    [nodes, deleteNode, setSelectedNode]
  );

  const handleAddChild = (nodeId: string, direction: 'left' | 'right') => {
    const targetNode = nodes.find((n) => n.id === nodeId) ?? null;
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

  const handleEnterConfirm = (nodeId: string) => {
    const target = nodes.find((n) => n.id === nodeId);
    if (!target) return;
    if (target.parentId === null) {
      handleAddChild(nodeId, 'right');
    } else {
      handleAddChild(target.parentId, target.direction ?? 'right');
    }
  };

  const handleTabConfirm = (nodeId: string) => {
    const target = nodes.find((n) => n.id === nodeId);
    if (!target) return;
    handleAddChild(nodeId, target.direction ?? 'right');
  };

  useKeyboardShortcuts();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;
  const hoveredNode = nodes.find((n) => n.id === hoveredNodeId) ?? null;

  const getAddButtonPositions = (node: MindmapNodeType) => {
    const isRoot = node.parentId === null;
    const rightEdge = node.x + node.width / 2;
    const leftEdge = node.x - node.width / 2;
    const y = cam.y + node.y * cam.zoom;
    if (isRoot)
      return [
        { x: cam.x + rightEdge * cam.zoom + 21, y, direction: 'right' as const, nodeId: node.id },
        { x: cam.x + leftEdge * cam.zoom - 21, y, direction: 'left' as const, nodeId: node.id },
      ];
    const dir = node.direction ?? 'right';
    const edgeX = dir === 'right' ? rightEdge : leftEdge;
    const offset = dir === 'right' ? 21 : -21;
    return [{ x: cam.x + edgeX * cam.zoom + offset, y, direction: dir, nodeId: node.id }];
  };

  const addButtonPositions = (() => {
    const targets = new Map<string, MindmapNodeType>();
    if (selectedNode) targets.set(selectedNode.id, selectedNode);
    if (hoveredNode && hoveredNode.id !== selectedNodeId) targets.set(hoveredNode.id, hoveredNode);
    return [...targets.values()].flatMap(getAddButtonPositions);
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
          isPlacing
            ? 'cursor-crosshair'
            : canvasMode === 'hand'
              ? 'cursor-grab active:cursor-grabbing'
              : ''
        )}
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={() => {
          setHoveredNode(null);
          if (isPlacing) setPlacingPos(null);
        }}
        onClick={(e) => {
          if (!isPlacing) return;
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;
          const worldX = (e.clientX - rect.left - cam.x) / cam.zoom;
          const worldY = (e.clientY - rect.top - cam.y) / cam.zoom;
          const newId = addNode({
            x: worldX,
            y: worldY,
            label: '',
            parentId: null,
            colorIndex: NODE_DEFAULT_COLOR_INDEX,
            size: 'M',
            shape: NODE_DEFAULT_SHAPE,
          });
          setIsPlacing(false);
          setPlacingPos(null);
          setSelectedNode(newId);
          setEditingNode(newId);
        }}
      >
        {isPlacing &&
          placingPos &&
          (() => {
            const style = NODE_STYLE['root'];
            const scale = NODE_SIZE_SCALE['M'];
            const nodeW = measureNodeWidth('새 항목', 'root', 'M');
            const nodeH = style.fontSize * scale * 1.4 + style.paddingY * scale * 2;
            const w = nodeW * cam.zoom;
            const h = nodeH * cam.zoom;
            const screenX = placingPos.x * cam.zoom + cam.x;
            const screenY = placingPos.y * cam.zoom + cam.y;
            return (
              <div
                style={{
                  position: 'absolute',
                  left: screenX - w / 2,
                  top: screenY - h / 2,
                  width: w,
                  height: h,
                  borderRadius: h / 2,
                  border: '2px solid var(--mm-acc-fg)',
                  background: 'color-mix(in srgb, var(--mm-acc-fg) 12%, transparent)',
                  opacity: 0.5,
                  pointerEvents: 'none',
                }}
              />
            );
          })()}
        {addButtonPositions.map((pos) => (
          <NodeAddButton
            key={`${pos.nodeId}-${pos.direction}`}
            x={pos.x}
            y={pos.y}
            direction={pos.direction}
            onClick={() => handleAddChild(pos.nodeId, pos.direction)}
          />
        ))}
        {popupPos && selectedNode && !isDragging && (
          <NodePopup
            x={popupPos.x}
            y={popupPos.y}
            yBelow={popupPos.yBelow}
            nodeColorIndex={selectedNode.colorIndex}
            onEdit={() => setEditingNode(selectedNode.id)}
            onMemoOpen={() =>
              setMemoPanelNodeId(memoPanelNodeId === selectedNode.id ? null : selectedNode.id)
            }
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
            onTextColorChange={(color) =>
              updateNode(selectedNode.id, { textColor: color ?? undefined })
            }
            bold={selectedNode.bold}
            italic={selectedNode.italic}
            underline={selectedNode.underline}
            strikethrough={selectedNode.strikethrough}
            onBoldChange={(v) => {
              const tier = selectedNode.parentId === null ? 'root' : 'child';
              const width = measureNodeWidth(
                selectedNode.label,
                tier,
                selectedNode.size ?? 'M',
                v,
                selectedNode.italic
              );
              updateNode(selectedNode.id, { bold: v, width });
            }}
            onItalicChange={(v) => {
              const tier = selectedNode.parentId === null ? 'root' : 'child';
              const width = measureNodeWidth(
                selectedNode.label,
                tier,
                selectedNode.size ?? 'M',
                selectedNode.bold,
                v
              );
              updateNode(selectedNode.id, { italic: v, width });
            }}
            onUnderlineChange={(v) => updateNode(selectedNode.id, { underline: v })}
            onStrikethroughChange={(v) => updateNode(selectedNode.id, { strikethrough: v })}
            hasMemo={Boolean(selectedNode.memo?.trim())}
            isRoot={selectedNode.parentId === null}
            autoLayout={selectedNode.autoLayout}
            onAutoLayoutChange={(v) => updateNode(selectedNode.id, { autoLayout: v })}
          />
        )}
        {editingNodeId && (
          <NodeEditor
            key={editingNodeId}
            nodeId={editingNodeId}
            onEnterConfirm={handleEnterConfirm}
            onTabConfirm={handleTabConfirm}
          />
        )}
        {memoPanelNodeId && <MemoPanel nodeId={memoPanelNodeId} />}
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
