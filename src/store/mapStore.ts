import { NODE_DEFAULT_COLOR } from '@/constants/node';
import { Edge, MindmapNode } from '@/types';
import { create } from 'zustand';

interface MapStore {
  nodes: MindmapNode[];
  edges: Edge[];
  addNode: (node: Omit<MindmapNode, 'id'>) => string;
  updateNode: (id: string, changes: Partial<MindmapNode>) => void;
  deleteNode: (id: string) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  nodes: [],
  edges: [],

  addNode: (node) => {
    const id = crypto.randomUUID();
    set((state) => ({
      nodes: [...state.nodes, { ...node, id, color: node.color ?? NODE_DEFAULT_COLOR }],
    }));
    return id;
  },

  updateNode: (id, changes) =>
    set((state) => ({ nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...changes } : n)) })),
  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id && n.parentId !== id),
      edges: state.edges.filter((e) => e.fromId !== id && e.toId !== id),
    })),
}));
