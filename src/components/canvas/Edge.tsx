import { useNodeRefs } from '@/context/NodeRefsContext';
import { MindmapNode } from '@/types';
import { resolveNodeColor } from '@/utils/node';
import Konva from 'konva';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { Line } from 'react-konva';

interface Props {
  fromNode: MindmapNode;
  toNode: MindmapNode;
}

export default function Edge({ fromNode, toNode }: Props) {
  const { resolvedTheme } = useTheme();
  const { registerEdge, unregisterEdge } = useNodeRefs();
  const isDark = resolvedTheme === 'dark';

  const fromColor = resolveNodeColor(fromNode, isDark);
  const toColor = resolveNodeColor(toNode, isDark);
  const bgLineRef = useRef<Konva.Line>(null);
  const gradLineRef = useRef<Konva.Line>(null);

  useEffect(() => {
    const lines: Konva.Line[] = [];
    if (bgLineRef.current) lines.push(bgLineRef.current);
    if (gradLineRef.current) lines.push(gradLineRef.current);
    registerEdge(toNode.id, lines);
    return () => unregisterEdge(toNode.id);
  }, [toNode.id]);

  const fromWidth = fromNode.width;
  const toWidth = toNode.width;

  const isLeft = toNode.direction === 'left';
  const x1 = isLeft ? fromNode.x - fromWidth / 2 : fromNode.x + fromWidth / 2;
  const y1 = fromNode.y;
  const x2 = isLeft ? toNode.x + toWidth / 2 : toNode.x - toWidth / 2;
  const y2 = toNode.y;
  const midX = x1 + (x2 - x1) * 0.5;

  const isTopTier = fromNode.parentId === null;
  const bgWidth = isTopTier ? 3.5 : 2;
  const lineWidth = isTopTier ? 1.8 : 1.2;

  const points = [x1, y1, midX, y1, midX, y2, x2, y2];

  return (
    <>
      <Line
        ref={bgLineRef}
        points={points}
        bezier={true}
        stroke={toColor}
        strokeWidth={bgWidth}
        opacity={0.18}
      />
      <Line
        ref={gradLineRef}
        points={points}
        bezier={true}
        strokeLinearGradientStartPoint={{ x: x1, y: y1 }}
        strokeLinearGradientEndPoint={{ x: x2, y: y2 }}
        strokeLinearGradientColorStops={[0, fromColor, 1, toColor]}
        strokeWidth={lineWidth}
        opacity={0.75}
      />
    </>
  );
}
