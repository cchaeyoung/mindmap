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
  direction?: 'left' | 'right';
  textColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  memo?: string;
  autoLayout?: boolean;
}

export interface Edge {
  id: string;
  fromId: string;
  toId: string;
}

export interface Mindmap {
  id: string;
  user_id: string;
  title: string;
  nodes: MindmapNode[];
  edges: Edge[];
  created_at: string;
  updated_at: string;
}

export type MindmapListItem = Pick<
  Mindmap,
  'id' | 'user_id' | 'title' | 'created_at' | 'updated_at'
>;
