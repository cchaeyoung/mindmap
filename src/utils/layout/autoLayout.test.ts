import { describe, it, expect } from 'vitest';
import { computeLayout } from './autoLayout';
import type { MindmapNode } from '@/types';

const base: Omit<MindmapNode, 'id' | 'parentId' | 'label'> = {
  x: 0,
  y: 0,
  width: 100,
  colorIndex: 0,
  size: 'M',
  shape: 'pill',
};

function makeNode(override: Partial<MindmapNode> & Pick<MindmapNode, 'id' | 'parentId'>): MindmapNode {
  return { ...base, label: '', ...override };
}

describe('computeLayout', () => {
  it('루트만 있으면 위치를 그대로 유지한다', () => {
    const nodes = [makeNode({ id: 'root', parentId: null, x: 200, y: 300 })];
    const layout = computeLayout(nodes);
    expect(layout.get('root')).toEqual({ x: 200, y: 300 });
  });

  it('autoLayout false인 루트는 처리하지 않는다', () => {
    const nodes = [makeNode({ id: 'root', parentId: null, autoLayout: false })];
    const layout = computeLayout(nodes);
    expect(layout.has('root')).toBe(false);
  });

  it('오른쪽 자식은 루트 오른쪽에 배치한다', () => {
    const nodes = [
      makeNode({ id: 'root', parentId: null, x: 0, y: 0, width: 100 }),
      makeNode({ id: 'child', parentId: 'root', direction: 'right', width: 80 }),
    ];
    const layout = computeLayout(nodes);
    expect(layout.get('child')!.x).toBeGreaterThan(0);
  });

  it('왼쪽 자식은 루트 왼쪽에 배치한다', () => {
    const nodes = [
      makeNode({ id: 'root', parentId: null, x: 0, y: 0, width: 100 }),
      makeNode({ id: 'child', parentId: 'root', direction: 'left', width: 80 }),
    ];
    const layout = computeLayout(nodes);
    expect(layout.get('child')!.x).toBeLessThan(0);
  });

  it('자식 여러 개일 때 겹치지 않는다', () => {
    const nodes = [
      makeNode({ id: 'root', parentId: null, x: 0, y: 0 }),
      makeNode({ id: 'c1', parentId: 'root', direction: 'right', width: 80 }),
      makeNode({ id: 'c2', parentId: 'root', direction: 'right', width: 80 }),
      makeNode({ id: 'c3', parentId: 'root', direction: 'right', width: 80 }),
    ];
    const layout = computeLayout(nodes);
    const y1 = layout.get('c1')!.y;
    const y2 = layout.get('c2')!.y;
    const y3 = layout.get('c3')!.y;
    expect(y2).toBeGreaterThan(y1);
    expect(y3).toBeGreaterThan(y2);
  });

  it('루트 여러 개는 각자 독립적으로 처리한다', () => {
    const nodes = [
      makeNode({ id: 'root1', parentId: null, x: 0, y: 0 }),
      makeNode({ id: 'root2', parentId: null, x: 500, y: 0 }),
    ];
    const layout = computeLayout(nodes);
    expect(layout.has('root1')).toBe(true);
    expect(layout.has('root2')).toBe(true);
  });
});
