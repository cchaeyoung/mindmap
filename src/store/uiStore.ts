import { create } from 'zustand';

interface UIStore {
  selectedNodeId: string | null;
  setSelectedNode: (id: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedNodeId: null,
  setSelectedNode: (id) => set({ selectedNodeId: id }),
}));
