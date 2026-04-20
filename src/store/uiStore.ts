import { create } from 'zustand';

interface UIStore {
  selectedNodeId: string | null;
  setSelectedNode: (id: string | null) => void;
  editingNodeId: string | null;
  setEditingNode: (id: string | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedNodeId: null,
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  editingNodeId: null,
  setEditingNode: (id) => set({ editingNodeId: id }),
  sidebarOpen: true,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
}));
