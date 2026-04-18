import { NODE_DEFAULT_COLOR } from '@/constants/node';
import { Edge, MindmapNode } from '@/types';
import { measureNodeWidth } from '@/utils/measureNodeWidth';
import { create } from 'zustand';

interface MapStore {
  nodes: MindmapNode[];
  edges: Edge[];
  addNode: (node: Omit<MindmapNode, 'id' | 'width'>) => string;
  updateNode: (id: string, changes: Partial<MindmapNode>) => void;
  deleteNode: (id: string) => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
  nodes: [],
  edges: [],

  addNode: (node) => {
    const id = crypto.randomUUID();
    const parent = get().nodes.find((n) => n.id === node.parentId);
    const tier = node.parentId === null ? 'root' : parent?.parentId === null ? 'child' : 'sub';
    const width = measureNodeWidth(node.label, tier);
    set((state) => ({
      nodes: [...state.nodes, { ...node, id, width, color: node.color ?? NODE_DEFAULT_COLOR }],
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
