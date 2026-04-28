import { create } from 'zustand';

interface UIStore {
  selectedNodeId: string | null;
  setSelectedNode: (id: string | null) => void;
  editingNodeId: string | null;
  setEditingNode: (id: string | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  canvasMode: 'select' | 'hand';
  setCanvasMode: (mode: 'select' | 'hand') => void;
  hoveredNodeId: string | null;
  setHoveredNode: (id: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedNodeId: null,
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  editingNodeId: null,
  setEditingNode: (id) => set({ editingNodeId: id }),
  sidebarOpen: true,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  isDragging: false,
  setIsDragging: (v) => set({ isDragging: v }),
  canvasMode: 'select',
  setCanvasMode: (mode) => set({ canvasMode: mode }),
  hoveredNodeId: null,
  setHoveredNode: (id) => set({ hoveredNodeId: id }),
}));
