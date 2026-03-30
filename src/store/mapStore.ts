import { Edge, Node } from '@/types';
import { create } from 'zustand';

interface MapStore {
  nodes: Node[];
  edges: Edge[];
  addNode: (node: Node) => void;
  updateNode: (id: string, changes: Partial<Node>) => void;
  deleteNode: (id: string) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  nodes: [],
  edges: [],

  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  updateNode: (id, changes) =>
    set((state) => ({ nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...changes } : n)) })),
  deleteNode: (id) => set((state) => ({ nodes: state.nodes.filter((n) => n.id !== id) })),
}));
