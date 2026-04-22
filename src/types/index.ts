export interface MindmapNode {
  id: string;
  x: number;
  y: number;
  label: string;
  width: number;
  parentId: string | null;
  color: string;
  isThemeColor?: boolean;
}

export interface Edge {
  id: string;
  fromId: string;
  toId: string;
}
