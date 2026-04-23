import type { MindmapNode } from '@/types';

const THEME_COLOR_DARK = 'rgba(255,255,255,0.9)';
const THEME_COLOR_LIGHT = 'rgba(14,12,42,0.92)';

export function resolveNodeColor(node: MindmapNode, resolvedTheme: string | undefined): string {
  if (node.isThemeColor) {
    return resolvedTheme === 'dark' ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
  }
  return node.color;
}
