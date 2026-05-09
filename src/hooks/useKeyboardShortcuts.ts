'use client';

import { useMapStore } from '@/store/mapStore';
import { useUIStore } from '@/store/uiStore';
import { useEffect } from 'react';

export function useKeyboardShortcuts() {
  const nodes = useMapStore((state) => state.nodes);
  const deleteNode = useMapStore((state) => state.deleteNode);
  const selectedNodeId = useUIStore((state) => state.selectedNodeId);
  const editingNodeId = useUIStore((state) => state.editingNodeId);
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId && !editingNodeId) {
        const node = nodes.find((n) => n.id === selectedNodeId);
        deleteNode(selectedNodeId);
        setSelectedNode(node?.parentId ?? null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, editingNodeId, nodes, deleteNode, setSelectedNode]);
}
