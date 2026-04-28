export interface MindmapNode {
  id: string;
  x: number;
  y: number;
  label: string;
  width: number;
  parentId: string | null;
  colorIndex: number;
  size: 'S' | 'M' | 'L';
  shape: 'pill' | 'round' | 'sharp';
}

export interface Edge {
  id: string;
  fromId: string;
  toId: string;
}
