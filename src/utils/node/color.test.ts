import { describe, it, expect } from 'vitest';
import { resolveColorByTheme, resolveNodeColor, hexToRgba } from './color';
import { NODE_COLORS_DARK, NODE_COLORS_LIGHT } from '@/constants/node';

describe('resolveColorByTheme', () => {
  it('다크 테마에서 올바른 팔레트 색상을 반환한다', () => {
    expect(resolveColorByTheme(1, true)).toBe(NODE_COLORS_DARK[1]);
    expect(resolveColorByTheme(8, true)).toBe(NODE_COLORS_DARK[8]);
  });

  it('라이트 테마에서 올바른 팔레트 색상을 반환한다', () => {
    expect(resolveColorByTheme(1, false)).toBe(NODE_COLORS_LIGHT[1]);
    expect(resolveColorByTheme(8, false)).toBe(NODE_COLORS_LIGHT[8]);
  });

  it('유효하지 않은 인덱스는 기본값(8번)을 반환한다', () => {
    expect(resolveColorByTheme(99, true)).toBe(NODE_COLORS_DARK[8]);
  });
});

describe('resolveNodeColor', () => {
  const baseNode = {
    id: '1',
    x: 0,
    y: 0,
    label: '',
    width: 100,
    parentId: null,
    colorIndex: 0,
    size: 'M' as const,
    shape: 'pill' as const,
  };

  it('colorIndex 0은 테마 강조색을 반환한다', () => {
    expect(resolveNodeColor({ ...baseNode, colorIndex: 0 }, true)).toBe('rgba(154,179,250,0.7)');
    expect(resolveNodeColor({ ...baseNode, colorIndex: 0 }, false)).toBe('rgba(54,82,199,0.5)');
  });

  it('colorIndex 0이 아니면 팔레트 색상을 반환한다', () => {
    expect(resolveNodeColor({ ...baseNode, colorIndex: 8 }, true)).toBe(NODE_COLORS_DARK[8]);
  });
});

describe('hexToRgba', () => {
  it('hex 색상을 rgba 문자열로 변환한다', () => {
    expect(hexToRgba('#4d69f0', 1)).toBe('rgba(77,105,240,1)');
    expect(hexToRgba('#ffffff', 0.5)).toBe('rgba(255,255,255,0.5)');
    expect(hexToRgba('#000000', 0)).toBe('rgba(0,0,0,0)');
  });
});
