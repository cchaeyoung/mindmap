import { describe, it, expect } from 'vitest';
import { computeLayout, computeNewNodePosition, centerSiblings } from './autoLayout';
import type { MindmapNode } from '@/types';

const base: Omit<MindmapNode, 'id' | 'parentId' | 'label'> = {
  x: 0,
  y: 0,
  width: 100,
  colorIndex: 0,
  size: 'M',
  shape: 'pill',
};

function makeNode(
  override: Partial<MindmapNode> & Pick<MindmapNode, 'id' | 'parentId'>
): MindmapNode {
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

describe('computeNewNodePosition', () => {
  it('오토레이아웃 OFF에서 첫 자식은 부모 y와 같은 위치에 배치한다', () => {
    const root = makeNode({ id: 'root', parentId: null, x: 0, y: 0, autoLayout: false });
    const { y } = computeNewNodePosition([root], 'root', 'right', 100);
    expect(y).toBe(0);
  });

  it('오토레이아웃 OFF에서 같은 방향 형제가 있으면 그 아래에 배치한다', () => {
    const root = makeNode({ id: 'root', parentId: null, x: 0, y: 0, autoLayout: false });
    const c1 = makeNode({ id: 'c1', parentId: 'root', direction: 'right', x: 230, y: 0 });
    const { y } = computeNewNodePosition([root, c1], 'root', 'right', 100);
    expect(y).toBeGreaterThan(0);
  });

  it('오토레이아웃 OFF에서 right 방향 x는 부모 오른쪽 엣지에서 간격만큼 떨어진다', () => {
    const root = makeNode({
      id: 'root',
      parentId: null,
      x: 0,
      y: 0,
      width: 120,
      autoLayout: false,
    });
    const { x } = computeNewNodePosition([root], 'root', 'right', 100);
    expect(x).toBe(60 + 80 + 50);
  });

  it('오토레이아웃 OFF에서 left 방향 x는 부모 왼쪽 엣지에서 간격만큼 떨어진다', () => {
    const root = makeNode({
      id: 'root',
      parentId: null,
      x: 0,
      y: 0,
      width: 120,
      autoLayout: false,
    });
    const { x } = computeNewNodePosition([root], 'root', 'left', 100);
    expect(x).toBe(-(60 + 80 + 50));
  });

  it('배열 순서가 아닌 y 기준 가장 아래 형제를 기준으로 배치한다', () => {
    const root = makeNode({ id: 'root', parentId: null, x: 0, y: 0, autoLayout: false });
    const c1 = makeNode({ id: 'c1', parentId: 'root', direction: 'right', x: 230, y: 200 });
    const c2 = makeNode({ id: 'c2', parentId: 'root', direction: 'right', x: 230, y: 0 });
    const { y } = computeNewNodePosition([root, c1, c2], 'root', 'right', 100);
    expect(y).toBeGreaterThan(200);
  });

  it('오토레이아웃 OFF에서 반대 방향 형제는 y 계산에 영향을 주지 않는다', () => {
    const root = makeNode({ id: 'root', parentId: null, x: 0, y: 0, autoLayout: false });
    const l1 = makeNode({ id: 'l1', parentId: 'root', direction: 'left', x: -230, y: 200 });
    const { y } = computeNewNodePosition([root, l1], 'root', 'right', 100);
    expect(y).toBe(0);
  });
});

describe('centerSiblings', () => {
  it('해당 방향 자식이 없으면 빈 배열을 반환한다', () => {
    const root = makeNode({ id: 'root', parentId: null });
    expect(centerSiblings([root], 'root', 'right')).toEqual([]);
  });

  it('자식이 1개이면 부모 y와 같은 위치로 정렬한다', () => {
    const root = makeNode({ id: 'root', parentId: null, x: 0, y: 0 });
    const c1 = makeNode({ id: 'c1', parentId: 'root', direction: 'right', x: 230, y: 50 });
    const result = centerSiblings([root, c1], 'root', 'right');
    expect(result.find((r) => r.id === 'c1')?.y).toBeCloseTo(0);
  });

  it('자식이 2개이면 부모 y 기준으로 위아래 대칭 배치한다', () => {
    const root = makeNode({ id: 'root', parentId: null, x: 0, y: 0 });
    const c1 = makeNode({ id: 'c1', parentId: 'root', direction: 'right', x: 230, y: -100 });
    const c2 = makeNode({ id: 'c2', parentId: 'root', direction: 'right', x: 230, y: 100 });
    const result = centerSiblings([root, c1, c2], 'root', 'right');
    const y1 = result.find((r) => r.id === 'c1')!.y;
    const y2 = result.find((r) => r.id === 'c2')!.y;
    expect(y1 + y2).toBeCloseTo(0);
    expect(y1).toBeLessThan(0);
    expect(y2).toBeGreaterThan(0);
  });

  it('반대 방향 자식은 결과에 포함하지 않는다', () => {
    const root = makeNode({ id: 'root', parentId: null, x: 0, y: 0 });
    const r1 = makeNode({ id: 'r1', parentId: 'root', direction: 'right', x: 230, y: 0 });
    const l1 = makeNode({ id: 'l1', parentId: 'root', direction: 'left', x: -230, y: 999 });
    const result = centerSiblings([root, r1, l1], 'root', 'right');
    expect(result.find((r) => r.id === 'l1')).toBeUndefined();
  });

  it('손자 노드도 형제와 같은 delta만큼 이동한다', () => {
    const root = makeNode({ id: 'root', parentId: null, x: 0, y: 0 });
    const c1 = makeNode({ id: 'c1', parentId: 'root', direction: 'right', x: 230, y: 100 });
    const g1 = makeNode({ id: 'g1', parentId: 'c1', direction: 'right', x: 460, y: 100 });
    const result = centerSiblings([root, c1, g1], 'root', 'right');
    const childY = result.find((r) => r.id === 'c1')!.y;
    const grandY = result.find((r) => r.id === 'g1')!.y;
    expect(grandY).toBeCloseTo(100 + (childY - 100));
  });
});
