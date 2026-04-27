import { NODE_COLORS_DARK, NODE_COLORS_LIGHT } from '@/constants/node';
import type { MindmapNode } from '@/types';

// colorIndex 0 = 테마색 (투명), 1-9 = 팔레트 색상
export function resolveColorByTheme(colorIndex: number, isDark: boolean): string {
  const palette = isDark ? NODE_COLORS_DARK : NODE_COLORS_LIGHT;
  return palette[colorIndex] ?? NODE_COLORS_DARK[8]!;
}

export function resolveNodeColor(node: MindmapNode, isDark: boolean): string {
  if (node.colorIndex === 0) {
    return isDark ? 'rgba(255,255,255,0.9)' : 'rgba(14,12,42,0.92)';
  }
  return resolveColorByTheme(node.colorIndex, isDark);
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
