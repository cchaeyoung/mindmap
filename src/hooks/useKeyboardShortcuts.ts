'use client';

import { useMapStore } from '@/store/mapStore';
import { useUIStore } from '@/store/uiStore';
import { measureNodeWidth } from '@/utils/node';
import { computeNewNodePosition, centerSiblings } from '@/utils/layout/autoLayout';
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
  const isPlacing = useUIStore((state) => state.isPlacing);
  const setIsPlacing = useUIStore((state) => state.setIsPlacing);
  const undo = useMapStore((state) => state.undo);
  const redo = useMapStore((state) => state.redo);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;
      const hasModifier = e.ctrlKey || e.metaKey || e.altKey;

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
      if (e.key === 'Escape') {
        if (isPlacing) {
          setIsPlacing(false);
          return;
        }
        if (selectedNodeId) {
          setSelectedNode(null);
          return;
        }
      }
      if (e.key.toLowerCase() === 'v' && !hasModifier) {
        setCanvasMode('select');
        setIsPlacing(false);
        return;
      }
      if (e.key.toLowerCase() === 'h' && !hasModifier) {
        setCanvasMode('hand');
        setIsPlacing(false);
        setSelectedNode(null);
        setEditingNode(null);
        return;
      }
      if (e.key === 'Tab' && selectedNodeId) {
        e.preventDefault();
        const latestNodes = useMapStore.getState().nodes;
        const node = latestNodes.find((n) => n.id === selectedNodeId);
        if (!node) return;
        const dir = node.direction ?? 'right';
        const newNodeWidth = measureNodeWidth('새 항목', 'child', 'M');
        const { x, y } = computeNewNodePosition(latestNodes, node.id, dir, newNodeWidth);
        const newId = addNode({
          x,
          y,
          label: '',
          parentId: node.id,
          colorIndex: node.colorIndex,
          size: 'M',
          shape: node.shape,
          direction: dir,
        });
        let root = node;
        while (root.parentId !== null) {
          const p = latestNodes.find((n) => n.id === root.parentId);
          if (!p) break;
          root = p;
        }
        if (root.autoLayout === false) {
          const afterAddNodes = useMapStore.getState().nodes;
          const reordered = centerSiblings(afterAddNodes, node.id, dir);
          if (reordered.length > 0) {
            useMapStore
              .getState()
              .updateNodes(reordered.map(({ id, y: newY }) => ({ id, changes: { y: newY } })));
          }
        }
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
      if (e.key.toLowerCase() === 'n' && !hasModifier) {
        e.preventDefault();
        setIsPlacing(true);
        setSelectedNode(null);
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
    setIsPlacing,
    isPlacing,
  ]);
}
