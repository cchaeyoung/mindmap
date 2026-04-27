import { Edge, MindmapNode } from '@/types';
import { measureNodeWidth } from '@/utils/node';
import { create } from 'zustand';

interface MapStore {
  nodes: MindmapNode[];
  edges: Edge[];
  addNode: (node: Omit<MindmapNode, 'id' | 'width'>) => string;
  updateNode: (id: string, changes: Partial<MindmapNode>) => void;
  deleteNode: (id: string) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  nodes: [],
  edges: [],

  addNode: (node) => {
    const id = crypto.randomUUID();
    const tier = node.parentId === null ? 'root' : 'child';
    const width = measureNodeWidth(node.label || '새 항목', tier, node.size ?? 'M');
    set((state) => ({
      nodes: [...state.nodes, { ...node, id, width, size: node.size ?? 'M' }],
    }));
    return id;
  },

  updateNode: (id, changes) =>
    set((state) => ({ nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...changes } : n)) })),
  deleteNode: (id) => {
    const getAllDescendants = (targetId: string, nodes: MindmapNode[]): string[] => {
      const children = nodes.filter((n) => n.parentId === targetId).map((n) => n.id);
      return [...children, ...children.flatMap((childId) => getAllDescendants(childId, nodes))];
    };
    set((state) => {
      const toDelete = new Set([id, ...getAllDescendants(id, state.nodes)]);
      return {
        nodes: state.nodes.filter((n) => !toDelete.has(n.id)),
        edges: state.edges.filter((e) => !toDelete.has(e.fromId) && !toDelete.has(e.toId)),
      };
    });
  },
}));
