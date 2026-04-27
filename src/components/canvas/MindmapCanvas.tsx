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

  const handleAddChild = () => {
    if (!selectedNode) return;
    const children = nodes.filter((n) => n.parentId === selectedNode.id);
    const newId = addNode({
      x: selectedNode.x + 200,
      y: selectedNode.y + children.length * 80,
      label: '',
      parentId: selectedNode.id,
      colorIndex: selectedNode.colorIndex,
      size: 'M',
    });
    setSelectedNode(newId);
    setEditingNode(newId);
  };

  const addButtonPos = (() => {
    if (!selectedNode) return null;
    const nodeWidth = selectedNode.width;
    const rightEdge = selectedNode.x + nodeWidth / 2;
    return {
      x: cam.x + rightEdge * cam.zoom + 21,
      y: cam.y + selectedNode.y * cam.zoom,
    };
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
      <div ref={containerRef} className="h-full w-full">
        {addButtonPos && (
          <NodeAddButton x={addButtonPos.x} y={addButtonPos.y} onClick={handleAddChild} />
        )}
        {popupPos && selectedNode && !isDragging && (
          <NodePopup
            x={popupPos.x}
            y={popupPos.y}
            yBelow={popupPos.yBelow}
            nodeColorIndex={selectedNode.colorIndex}
            onAddChild={handleAddChild}
            onEdit={() => setEditingNode(selectedNode.id)}
            onDelete={() => handleDeleteNode(selectedNode.id)}
            onColorChange={(colorIndex) =>
              updateNode(selectedNode.id, { colorIndex })
            }
            currentSize={selectedNode.size ?? 'M'}
            onSizeChange={(sz) => {
                const tier = selectedNode.parentId === null ? 'root' : 'child';
                const width = measureNodeWidth(selectedNode.label, tier, sz);
                updateNode(selectedNode.id, { size: sz, width });
              }}
          />
        )}
        {editingNodeId && (
          <NodeEditor nodeId={editingNodeId} />
        )}
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
                isEditing={node.id === editingNodeId}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </NodeRefsProvider>
  );
}
