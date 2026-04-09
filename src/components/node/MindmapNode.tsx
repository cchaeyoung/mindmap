import { NODE_STYLE } from '@/constants/node';
import { useMapStore } from '@/store/mapStore';
import { useUIStore } from '@/store/uiStore';
import type { MindmapNode } from '@/types';
import { useRef } from 'react';
import { Group, Rect, Text } from 'react-konva';

interface Props {
  node: MindmapNode;
  isSelected: boolean;
  depth: number;
}

export default function MindmapNode({ node, isSelected, depth }: Props) {
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const updateNode = useMapStore((state) => state.updateNode);
  const nodes = useMapStore((state) => state.nodes);
  const prevPos = useRef({ x: node.x, y: node.y });

  const getDescendants = (id: string): string[] => {
    const children = nodes.filter((n) => n.parentId === id).map((n) => n.id);
    return [...children, ...children.flatMap((childId) => getDescendants(childId))];
  };

  const tier = node.parentId === null ? 'root' : depth === 1 ? 'child' : 'sub';
  const style = NODE_STYLE[tier];

  const width = style.paddingX * 2 + 120; // 임시 고정값
  const height = style.fontSize * 1.4 + style.paddingY * 2;
  const radius = style.cornerRadius === 'pill' ? height / 2 : style.cornerRadius;

  return (
    <Group
      x={node.x}
      y={node.y}
      draggable
      onClick={() => setSelectedNode(node.id)}
      onMouseDown={(e) => {
        e.cancelBubble = true;
      }}
      onDragStart={(e) => {
        prevPos.current = { x: e.target.x(), y: e.target.y() };
      }}
      onDragMove={(e) => {
        const x = e.target.x();
        const y = e.target.y();
        const dx = x - prevPos.current.x;
        const dy = y - prevPos.current.y;
        prevPos.current = { x, y };
        updateNode(node.id, { x, y });
        getDescendants(node.id).forEach((id) => {
          const n = nodes.find((n) => n.id === id)!;
          updateNode(id, { x: n.x + dx, y: n.y + dy });
        });
      }}
      onDragEnd={(e) => updateNode(node.id, { x: e.target.x(), y: e.target.y() })}
    >
      {isSelected && (
        <Rect
          width={width + 6}
          height={height + 6}
          offsetX={(width + 6) / 2}
          offsetY={(height + 6) / 2}
          cornerRadius={radius + 3}
          stroke={node.color}
          strokeWidth={1.5}
        />
      )}
      <Rect
        width={width}
        height={height}
        offsetX={width / 2}
        offsetY={height / 2}
        fill={node.color}
        cornerRadius={radius}
      />
      <Text
        text={node.label}
        fontSize={style.fontSize}
        fontStyle={String(style.fontWeight)}
        fill="rgba(255,255,255,0.95)"
        width={width}
        height={height}
        offsetX={width / 2}
        offsetY={height / 2}
        align="center"
        verticalAlign="middle"
      />
    </Group>
  );
}
