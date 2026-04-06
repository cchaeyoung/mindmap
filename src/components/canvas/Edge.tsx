import { NODE_STYLE } from '@/constants/node';
import { MindmapNode } from '@/types';
import { Line } from 'react-konva';

interface Props {
  fromNode: MindmapNode;
  toNode: MindmapNode;
}

const NODE_BASE_WIDTH = 120;

export default function Edge({ fromNode, toNode }: Props) {
  const fromTier = fromNode.parentId === null ? 'root' : 'child';
  const toTier = toNode.parentId === null ? 'root' : 'child';
  const fromWidth = NODE_STYLE[fromTier].paddingX * 2 + NODE_BASE_WIDTH;
  const toWidth = NODE_STYLE[toTier].paddingX * 2 + NODE_BASE_WIDTH;

  return (
    <Line
      points={[fromNode.x + fromWidth / 2, fromNode.y, toNode.x - toWidth / 2, toNode.y]}
      stroke={toNode.color}
      strokeWidth={2}
    />
  );
}
