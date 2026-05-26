import { NODE_SIZE_SCALE, NODE_STYLE } from '@/constants/node';
import { MindmapNode } from '@/types';

const VERTICAL_GAP = 24;
const HORIZONTAL_GAP = 80;

function nodeHeight(node: MindmapNode): number {
  const tier = node.parentId === null ? 'root' : 'child';
  const style = NODE_STYLE[tier];
  const scale = NODE_SIZE_SCALE[node.size];
  return style.fontSize * scale * 1.4 + style.paddingY * scale * 2;
}

function subtreeHeight(nodeId: string, nodes: MindmapNode[]): number {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return 0;
  const children = nodes.filter((n) => n.parentId === nodeId);
  if (children.length === 0) return nodeHeight(node);
  const childrenTotal = children.reduce((sum, c) => sum + subtreeHeight(c.id, nodes), 0);
  return Math.max(nodeHeight(node), childrenTotal + (children.length - 1) * VERTICAL_GAP);
}

function layoutBranch(
  parentId: string,
  parentX: number,
  parentY: number,
  parentWidth: number,
  direction: 'left' | 'right',
  nodes: MindmapNode[],
  result: Map<string, { x: number; y: number }>
): void {
  const children = nodes.filter((n) => n.parentId === parentId);
  if (children.length === 0) return;

  const totalHeight =
    children.reduce((sum, c) => sum + subtreeHeight(c.id, nodes), 0) +
    (children.length - 1) * VERTICAL_GAP;

  let currentY = parentY - totalHeight / 2;

  for (const child of children) {
    const h = subtreeHeight(child.id, nodes);
    const childY = currentY + h / 2;
    const childX =
      direction === 'right'
        ? parentX + parentWidth / 2 + HORIZONTAL_GAP + child.width / 2
        : parentX - parentWidth / 2 - HORIZONTAL_GAP - child.width / 2;

    result.set(child.id, { x: childX, y: childY });
    layoutBranch(child.id, childX, childY, child.width, direction, nodes, result);
    currentY += h + VERTICAL_GAP;
  }
}

function layoutRoot(
  root: MindmapNode,
  nodes: MindmapNode[],
  result: Map<string, { x: number; y: number }>
): void {
  result.set(root.id, { x: root.x, y: root.y });

  const rightChildren = nodes.filter((n) => n.parentId === root.id && n.direction !== 'left');
  const leftChildren = nodes.filter((n) => n.parentId === root.id && n.direction === 'left');

  if (rightChildren.length > 0) {
    const totalHeight =
      rightChildren.reduce((sum, c) => sum + subtreeHeight(c.id, nodes), 0) +
      (rightChildren.length - 1) * VERTICAL_GAP;
    let currentY = root.y - totalHeight / 2;
    for (const child of rightChildren) {
      const h = subtreeHeight(child.id, nodes);
      const childY = currentY + h / 2;
      const childX = root.x + root.width / 2 + HORIZONTAL_GAP + child.width / 2;
      result.set(child.id, { x: childX, y: childY });
      layoutBranch(child.id, childX, childY, child.width, 'right', nodes, result);
      currentY += h + VERTICAL_GAP;
    }
  }

  if (leftChildren.length > 0) {
    const totalHeight =
      leftChildren.reduce((sum, c) => sum + subtreeHeight(c.id, nodes), 0) +
      (leftChildren.length - 1) * VERTICAL_GAP;
    let currentY = root.y - totalHeight / 2;
    for (const child of leftChildren) {
      const h = subtreeHeight(child.id, nodes);
      const childY = currentY + h / 2;
      const childX = root.x - root.width / 2 - HORIZONTAL_GAP - child.width / 2;
      result.set(child.id, { x: childX, y: childY });
      layoutBranch(child.id, childX, childY, child.width, 'left', nodes, result);
      currentY += h + VERTICAL_GAP;
    }
  }
}

export function computeLayout(nodes: MindmapNode[]): Map<string, { x: number; y: number }> {
  const result = new Map<string, { x: number; y: number }>();
  const roots = nodes.filter((n) => n.parentId === null && n.autoLayout !== false);
  for (const root of roots) {
    layoutRoot(root, nodes, result);
  }
  return result;
}

export function computeNewNodePosition(
  nodes: MindmapNode[],
  parentId: string,
  direction: 'left' | 'right',
  newNodeWidth: number
): { x: number; y: number } {
  const parent = nodes.find((n) => n.id === parentId);
  if (!parent) return { x: 0, y: 0 };

  let root = parent;
  while (root.parentId !== null) {
    const p = nodes.find((n) => n.id === root.parentId);
    if (!p) break;
    root = p;
  }

  if (root.autoLayout !== false) {
    const children = nodes.filter((n) => n.parentId === parentId);
    return {
      x: direction === 'right' ? parent.x + 200 : parent.x - 200,
      y: parent.y + children.length * 80,
    };
  }

  const x =
    direction === 'right'
      ? parent.x + parent.width / 2 + HORIZONTAL_GAP + newNodeWidth / 2
      : parent.x - parent.width / 2 - HORIZONTAL_GAP - newNodeWidth / 2;

  const sameDirectionSiblings = nodes.filter(
    (n) => n.parentId === parentId && n.direction === direction
  );

  let y: number;
  if (sameDirectionSiblings.length === 0) {
    y = parent.y;
  } else {
    const lastSibling = sameDirectionSiblings[sameDirectionSiblings.length - 1];
    const lastSiblingH = subtreeHeight(lastSibling.id, nodes);
    const newNodeH = nodeHeight({ size: 'M', parentId } as MindmapNode);
    y = lastSibling.y + lastSiblingH / 2 + VERTICAL_GAP + newNodeH / 2;
  }

  return { x, y };
}

function getDescendantIds(nodeId: string, nodes: MindmapNode[]): string[] {
  const children = nodes.filter((n) => n.parentId === nodeId);
  return children.flatMap((c) => [c.id, ...getDescendantIds(c.id, nodes)]);
}

export function centerSiblings(
  nodes: MindmapNode[],
  parentId: string,
  direction: 'left' | 'right'
): { id: string; y: number }[] {
  const parent = nodes.find((n) => n.id === parentId);
  if (!parent) return [];
  const children = nodes
    .filter((n) => n.parentId === parentId && n.direction === direction)
    .sort((a, b) => a.y - b.y);
  if (children.length === 0) return [];
  const totalHeight =
    children.reduce((sum, c) => sum + subtreeHeight(c.id, nodes), 0) +
    (children.length - 1) * VERTICAL_GAP;
  let currentY = parent.y - totalHeight / 2;
  const result: { id: string; y: number }[] = [];
  for (const child of children) {
    const h = subtreeHeight(child.id, nodes);
    const childY = currentY + h / 2;
    const delta = childY - child.y;
    result.push({ id: child.id, y: childY });
    for (const descId of getDescendantIds(child.id, nodes)) {
      const desc = nodes.find((n) => n.id === descId);
      if (desc) result.push({ id: descId, y: desc.y + delta });
    }
    currentY += h + VERTICAL_GAP;
  }
  return result;
}
