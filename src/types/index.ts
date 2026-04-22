export interface MindmapNode {
  id: string;
  x: number;
  y: number;
  label: string;
  width: number;
  parentId: string | null;
  color: string;
  isThemeColor?: boolean;
  size: 'S' | 'M' | 'L';
}

export interface Edge {
  id: string;
  fromId: string;
  toId: string;
}
