import { NODE_STYLE } from '@/constants/node';
import { useUIStore } from '@/store/uiStore';
import type { MindmapNode } from '@/types';
import { Group, Rect, Text } from 'react-konva';

interface Props {
  node: MindmapNode;
  isSelected: boolean;
  depth: number;
}

export default function MindmapNode({ node, isSelected, depth }: Props) {
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const tier = node.parentId === null ? 'root' : depth === 1 ? 'child' : 'sub';
  const style = NODE_STYLE[tier];

  const width = style.paddingX * 2 + 120; // 임시 고정값
  const height = style.fontSize * 1.4 + style.paddingY * 2;
  const radius = style.cornerRadius === 'pill' ? height / 2 : style.cornerRadius;

  return (
    <Group x={node.x} y={node.y} onClick={() => setSelectedNode(node.id)}>
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
