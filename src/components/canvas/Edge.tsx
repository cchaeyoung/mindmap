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

  const x1 = fromNode.x + fromWidth / 2;
  const y1 = fromNode.y;
  const x2 = toNode.x - toWidth / 2;
  const y2 = toNode.y;
  const midX = x1 + (x2 - x1) * 0.5;

  const isTopTier = fromNode.parentId === null;
  const bgWidth = isTopTier ? 3.5 : 2;
  const lineWidth = isTopTier ? 1.8 : 1.2;

  return (
    <>
      <Line
        points={[x1, y1, midX, y1, midX, y2, x2, y2]}
        bezier={true}
        stroke={toNode.color}
        strokeWidth={bgWidth}
        opacity={0.18}
      />
      <Line
        points={[x1, y1, midX, y1, midX, y2, x2, y2]}
        bezier={true}
        strokeLinearGradientStartPoint={{ x: x1, y: y1 }}
        strokeLinearGradientEndPoint={{ x: x2, y: y2 }}
        strokeLinearGradientColorStops={[0, fromNode.color, 1, toNode.color]}
        strokeWidth={lineWidth}
        opacity={0.75}
      />
    </>
  );
}
