'use client';

import Konva from 'konva';
import { RefObject, createContext, useContext, useRef } from 'react';

interface NodeRefsContextValue {
  nodeRefs: RefObject<Map<string, Konva.Group>>;
  edgeRefs: RefObject<Map<string, Konva.Line[]>>;
  registerNode: (id: string, ref: Konva.Group) => void;
  unregisterNode: (id: string) => void;
  registerEdge: (id: string, refs: Konva.Line[]) => void;
  unregisterEdge: (id: string) => void;
  addButtonRightRef: RefObject<HTMLDivElement | null>;
  addButtonLeftRef: RefObject<HTMLDivElement | null>;
}

const NodeRefsContext = createContext<NodeRefsContextValue | null>(null);

export function NodeRefsProvider({ children }: { children: React.ReactNode }) {
  const nodeRefs = useRef<Map<string, Konva.Group>>(new Map());
  const edgeRefs = useRef<Map<string, Konva.Line[]>>(new Map());

  const registerNode = (id: string, ref: Konva.Group) => nodeRefs.current.set(id, ref);
  const unregisterNode = (id: string) => nodeRefs.current.delete(id);
  const registerEdge = (id: string, refs: Konva.Line[]) => edgeRefs.current.set(id, refs);
  const unregisterEdge = (id: string) => edgeRefs.current.delete(id);

  const addButtonRightRef = useRef<HTMLDivElement | null>(null);
  const addButtonLeftRef = useRef<HTMLDivElement | null>(null);

  return (
    <NodeRefsContext.Provider
      value={{
        nodeRefs,
        edgeRefs,
        registerNode,
        unregisterNode,
        registerEdge,
        unregisterEdge,
        addButtonRightRef,
        addButtonLeftRef,
      }}
    >
      {children}
    </NodeRefsContext.Provider>
  );
}

export function useNodeRefs() {
  const ctx = useContext(NodeRefsContext);
  if (!ctx) throw new Error('useNodeRefs must be used within a NodeRefsProvider');
  return ctx;
}
