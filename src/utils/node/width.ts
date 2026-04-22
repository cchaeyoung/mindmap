import { NODE_MIN_TEXT_WIDTH, NODE_STYLE } from '@/constants/node';

type Tier = 'root' | 'child' | 'sub';

export function measureNodeWidth(text: string, tier: Tier): number {
  const style = NODE_STYLE[tier];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.font = `${style.fontWeight} ${style.fontSize}px Pretendard, sans-serif`;
  const textWidth = ctx.measureText(text || ' ').width;
  return style.paddingX * 2 + Math.max(Math.ceil(textWidth), NODE_MIN_TEXT_WIDTH);
}
