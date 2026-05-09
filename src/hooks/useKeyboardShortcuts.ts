'use client';

import { NODE_DEFAULT_COLOR_INDEX, NODE_DEFAULT_SHAPE } from '@/constants/node';
import { useCanvasStore } from '@/store/canvasStore';
import { useMapStore } from '@/store/mapStore';
import { useUIStore } from '@/store/uiStore';
import { measureNodeWidth } from '@/utils/node';
import { useEffect } from 'react';

export function useKeyboardShortcuts() {
  const nodes = useMapStore((state) => state.nodes);
  const deleteNode = useMapStore((state) => state.deleteNode);
  const addNode = useMapStore((state) => state.addNode);
  const updateNode = useMapStore((state) => state.updateNode);
  const selectedNodeId = useUIStore((state) => state.selectedNodeId);
  const editingNodeId = useUIStore((state) => state.editingNodeId);
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const setEditingNode = useUIStore((state) => state.setEditingNode);
  const setCanvasMode = useUIStore((state) => state.setCanvasMode);
  const undo = useMapStore((state) => state.undo);
  const redo = useMapStore((state) => state.redo);
  const cam = useCanvasStore((state) => state.cam);
  const stageSize = useCanvasStore((state) => state.stageSize);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId && !editingNodeId) {
        e.preventDefault();
        const node = nodes.find((n) => n.id === selectedNodeId);
        deleteNode(selectedNodeId);
        setSelectedNode(node?.parentId ?? null);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
        redo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undo();
        return;
      }
      if (e.key === 'Enter' && selectedNodeId && !editingNodeId) {
        setEditingNode(selectedNodeId);
        return;
      }
      if (e.key === 'Escape' && selectedNodeId) {
        setSelectedNode(null);
        return;
      }
      if (e.key.toLowerCase() === 'v' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setCanvasMode('select');
        return;
      }
      if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setCanvasMode('hand');
        setSelectedNode(null);
        setEditingNode(null);
        return;
      }
      if (e.key === 'Tab' && selectedNodeId) {
        e.preventDefault();
        const node = nodes.find((n) => n.id === selectedNodeId);
        if (!node) return;
        const dir = node.direction ?? 'right';
        const children = nodes.filter((n) => n.parentId === node.id);
        const newId = addNode({
          x: dir === 'right' ? node.x + 200 : node.x - 200,
          y: node.y + children.length * 80,
          label: '',
          parentId: node.id,
          colorIndex: node.colorIndex,
          size: 'M',
          shape: node.shape,
          direction: dir,
        });
        setCanvasMode('select');
        setSelectedNode(newId);
        setEditingNode(newId);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b' && selectedNodeId) {
        e.preventDefault();
        const node = nodes.find((n) => n.id === selectedNodeId);
        if (!node) return;
        const tier = node.parentId === null ? 'root' : 'child';
        const newBold = !node.bold;
        const width = measureNodeWidth(node.label, tier, node.size ?? 'M', newBold, node.italic);
        updateNode(selectedNodeId, { bold: newBold, width });
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'i' && selectedNodeId) {
        e.preventDefault();
        const node = nodes.find((n) => n.id === selectedNodeId);
        if (!node) return;
        const tier = node.parentId === null ? 'root' : 'child';
        const newItalic = !node.italic;
        const width = measureNodeWidth(node.label, tier, node.size ?? 'M', node.bold, newItalic);
        updateNode(selectedNodeId, { italic: newItalic, width });
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'u' && selectedNodeId) {
        e.preventDefault();
        const node = nodes.find((n) => n.id === selectedNodeId);
        if (!node) return;
        updateNode(selectedNodeId, { underline: !node.underline });
        return;
      }
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setCanvasMode('select');
        const centerX = (-cam.x + stageSize.width / 2) / cam.zoom;
        const centerY = (-cam.y + stageSize.height / 2) / cam.zoom;
        const newId = addNode({
          x: centerX,
          y: centerY,
          label: '',
          parentId: null,
          colorIndex: NODE_DEFAULT_COLOR_INDEX,
          size: 'M',
          shape: NODE_DEFAULT_SHAPE,
        });
        setSelectedNode(newId);
        setEditingNode(newId);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedNodeId,
    editingNodeId,
    nodes,
    deleteNode,
    addNode,
    updateNode,
    setSelectedNode,
    redo,
    undo,
    setCanvasMode,
    setEditingNode,
    cam,
    stageSize,
  ]);
}
