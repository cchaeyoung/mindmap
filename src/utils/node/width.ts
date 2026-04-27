import { NODE_SIZE_SCALE, NODE_STYLE } from '@/constants/node';

type Tier = 'root' | 'child';
type Size = 'S' | 'M' | 'L';

let ctx: CanvasRenderingContext2D | null = null;

function getCtx(): CanvasRenderingContext2D {
  if (!ctx) {
    ctx = document.createElement('canvas').getContext('2d')!;
  }
  return ctx;
}

export function measureNodeWidth(text: string, tier: Tier, size: Size = 'M'): number {
  const style = NODE_STYLE[tier];
  const scale = NODE_SIZE_SCALE[size];
  getCtx().font = `${style.fontWeight} ${style.fontSize * scale}px Pretendard, sans-serif`;
  const textWidth = getCtx().measureText(text).width;
  return style.paddingX * scale * 2 + Math.ceil(textWidth);
}
