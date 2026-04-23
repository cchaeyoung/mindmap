import { NODE_MIN_TEXT_WIDTH, NODE_SIZE_SCALE, NODE_STYLE } from '@/constants/node';

type Tier = 'root' | 'child' | 'sub';
type Size = 'S' | 'M' | 'L';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;

export function measureNodeWidth(text: string, tier: Tier, size: Size = 'M'): number {
  const style = NODE_STYLE[tier];
  const scale = NODE_SIZE_SCALE[size];
  ctx.font = `${style.fontWeight} ${style.fontSize * scale}px Pretendard, sans-serif`;
  const textWidth = ctx.measureText(text || ' ').width;
  return style.paddingX * scale * 2 + Math.max(Math.ceil(textWidth), NODE_MIN_TEXT_WIDTH);
}
