export interface MindmapNode {
  id: string;
  x: number;
  y: number;
  label: string;
  width: number;
  parentId: string | null;
  color: string;
}

export interface Edge {
  id: string;
  fromId: string;
  toId: string;
}
