import { Edge, MindmapNode } from '@/types';
import { measureNodeWidth } from '@/utils/node';
import { create } from 'zustand';
import { useUIStore } from './uiStore';

interface MapStore {
  nodes: MindmapNode[];
  edges: Edge[];
  history: MindmapNode[][];
  historyIndex: number;
  justAddedNodeId: string | null;
  saveHistory: () => void;
  mergeLastHistory: () => void;
  confirmNodeCreation: () => void;
  undo: () => void;
  redo: () => void;
  addNode: (node: Omit<MindmapNode, 'id' | 'width'>) => string;
  updateNode: (id: string, changes: Partial<MindmapNode>, opts?: { skipHistory?: boolean }) => void;
  deleteNode: (id: string) => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
  nodes: [],
  edges: [],
  history: [[]],
  historyIndex: 0,
  justAddedNodeId: null,

  saveHistory: () => {
    const { nodes, history, historyIndex } = get();
    const trimmed = history.slice(0, historyIndex + 1);
    const next = [...trimmed, [...nodes]].slice(-50);
    set({ history: next, historyIndex: next.length - 1 });
  },

  mergeLastHistory: () => {
    const { nodes, history, historyIndex } = get();
    const updated = [...history];
    updated[historyIndex] = [...nodes];
    set({ history: updated });
  },

  confirmNodeCreation: () => {
    const { nodes, history, historyIndex } = get();
    const updated = [...history];
    updated[historyIndex] = [...nodes];
    set({ history: updated, justAddedNodeId: null });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const newNodes = history[historyIndex - 1];
    set({ nodes: newNodes, historyIndex: historyIndex - 1 });
    const {
      selectedNodeId,
      setSelectedNode,
      editingNodeId,
      setEditingNode,
      memoPanelNodeId,
      setMemoPanelNode,
    } = useUIStore.getState();
    if (selectedNodeId && !newNodes.find((n) => n.id === selectedNodeId)) setSelectedNode(null);
    if (editingNodeId && !newNodes.find((n) => n.id === editingNodeId)) setEditingNode(null);
    if (memoPanelNodeId && !newNodes.find((n) => n.id === memoPanelNodeId)) setMemoPanelNode(null);
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const newNodes = history[historyIndex + 1];
    set({ nodes: newNodes, historyIndex: historyIndex + 1 });
    const {
      selectedNodeId,
      setSelectedNode,
      editingNodeId,
      setEditingNode,
      memoPanelNodeId,
      setMemoPanelNode,
    } = useUIStore.getState();
    if (selectedNodeId && !newNodes.find((n) => n.id === selectedNodeId)) setSelectedNode(null);
    if (editingNodeId && !newNodes.find((n) => n.id === editingNodeId)) setEditingNode(null);
    if (memoPanelNodeId && !newNodes.find((n) => n.id === memoPanelNodeId)) setMemoPanelNode(null);
  },

  addNode: (node) => {
    const id = crypto.randomUUID();
    const tier = node.parentId === null ? 'root' : 'child';
    const width = measureNodeWidth(node.label || '새 항목', tier, node.size);
    set((state) => ({
      nodes: [...state.nodes, { ...node, id, width }],
    }));
    get().saveHistory();
    set({ justAddedNodeId: id });
    return id;
  },

  updateNode: (id, changes, opts) => {
    set((state) => ({ nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...changes } : n)) }));
    if (!opts?.skipHistory) get().saveHistory();
  },

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
    get().saveHistory();
  },
}));
