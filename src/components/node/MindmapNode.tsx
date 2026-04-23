import { NODE_SIZE_SCALE, NODE_STYLE } from '@/constants/node';
import { resolveNodeColor } from '@/utils/node';
import { useNodeRefs } from '@/context/NodeRefsContext';
import { useCanvasStore } from '@/store/canvasStore';
import { useMapStore } from '@/store/mapStore';
import { useUIStore } from '@/store/uiStore';
import type { MindmapNode } from '@/types';
import Konva from 'konva';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { Group, Rect, Text } from 'react-konva';

interface Props {
  node: MindmapNode;
  isSelected: boolean;
  isEditing: boolean;
  depth: number;
}

export default function MindmapNode({ node, isSelected, isEditing, depth }: Props) {
  const { resolvedTheme } = useTheme();
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const setEditingNode = useUIStore((state) => state.setEditingNode);
  const setIsDragging = useUIStore((state) => state.setIsDragging);
  const updateNode = useMapStore((state) => state.updateNode);
  const nodes = useMapStore((state) => state.nodes);
  const cam = useCanvasStore((state) => state.cam);
  const camRef = useRef(cam);
  useEffect(() => {
    camRef.current = cam;
  }, [cam]);
  const { nodeRefs, edgeRefs, registerNode, unregisterNode, addButtonRef } = useNodeRefs();
  const groupRef = useRef<Konva.Group>(null);
  const prevPos = useRef({ x: node.x, y: node.y });

  useEffect(() => {
    if (groupRef.current) registerNode(node.id, groupRef.current);
    return () => unregisterNode(node.id);
  }, [node.id]);

  const getDescendants = (id: string): string[] => {
    const children = nodes.filter((n) => n.parentId === id).map((n) => n.id);
    return [...children, ...children.flatMap((childId) => getDescendants(childId))];
  };

  const tier = node.parentId === null ? 'root' : depth === 1 ? 'child' : 'sub';
  const style = NODE_STYLE[tier];

  const fill = resolveNodeColor(node, resolvedTheme);
  const scale = NODE_SIZE_SCALE[node.size ?? 'M'];

  const width = node.width;
  const height = style.fontSize * scale * 1.4 + style.paddingY * scale * 2;
  const radius = style.cornerRadius === 'pill' ? height / 2 : style.cornerRadius;

  return (
    <Group
      ref={groupRef}
      x={node.x}
      y={node.y}
      draggable
      onClick={() => setSelectedNode(node.id)}
      onDblClick={() => {
        setSelectedNode(node.id);
        setEditingNode(node.id);
      }}
      onMouseDown={(e) => {
        e.cancelBubble = true;
        if (!isSelected) setSelectedNode(null);
      }}
      onDragStart={(e) => {
        setIsDragging(true);
        prevPos.current = { x: e.target.x(), y: e.target.y() };
      }}
      onDragMove={(e) => {
        const x = e.target.x();
        const y = e.target.y();
        const dx = x - prevPos.current.x;
        const dy = y - prevPos.current.y;
        prevPos.current = { x, y };

        const descendants = getDescendants(node.id);
        descendants.forEach((id) => {
          const ref = nodeRefs.current.get(id);
          if (ref) {
            const pos = ref.position();
            ref.position({ x: pos.x + dx, y: pos.y + dy });
          }
        });

        // 연결선 업데이트
        const allMoved = [node.id, ...descendants];
        allMoved.forEach((id) => {
          const nodeRef = nodeRefs.current.get(id);
          if (!nodeRef) return;
          const pos = nodeRef.position();
          const nodeData = nodes.find((n) => n.id === id);
          if (!nodeData) return;

          // 이 노드가 toNode인 엣지 업데이트
          const edgeLines = edgeRefs.current.get(id);
          if (edgeLines) {
            const parentRef = nodeRefs.current.get(nodeData.parentId!);
            if (parentRef) {
              const parentPos = parentRef.position();
              const parentData = nodes.find((n) => n.id === nodeData.parentId);
              const fromWidth = parentData?.width ?? node.width;
              const toWidth = nodeData.width;
              const x1 = parentPos.x + fromWidth / 2;
              const y1 = parentPos.y;
              const x2 = pos.x - toWidth / 2;
              const y2 = pos.y;
              const midX = x1 + (x2 - x1) * 0.5;
              const points = [x1, y1, midX, y1, midX, y2, x2, y2];
              edgeLines.forEach((line) => line.points(points));
            }
          }
        });

        if (isSelected && addButtonRef.current) {
          const c = camRef.current;
          const screenX = c.x + (x + node.width / 2) * c.zoom + 21;
          const screenY = c.y + y * c.zoom;
          addButtonRef.current.style.left = `${screenX}px`;
          addButtonRef.current.style.top = `${screenY}px`;
        }
      }}
      onDragEnd={(e) => {
        setIsDragging(false);
        setSelectedNode(node.id);

        const x = e.target.x();
        const y = e.target.y();
        const descendants = getDescendants(node.id);

        updateNode(node.id, { x, y });
        descendants.forEach((id) => {
          const ref = nodeRefs.current.get(id);
          if (ref) {
            const pos = ref.position();
            updateNode(id, { x: pos.x, y: pos.y });
          }
        });
      }}
    >
      {isSelected && (
        <Rect
          width={width + 6}
          height={height + 6}
          offsetX={(width + 6) / 2}
          offsetY={(height + 6) / 2}
          cornerRadius={radius + 3}
          stroke={fill}
          strokeWidth={1.5}
        />
      )}
      <Rect
        width={width}
        height={height}
        offsetX={width / 2}
        offsetY={height / 2}
        fill={fill}
        cornerRadius={radius}
      />
      <Text
        text={node.label}
        fontSize={style.fontSize * scale}
        fontFamily="Pretendard, sans-serif"
        fontStyle={String(style.fontWeight)}
        fill="rgba(255,255,255,0.95)"
        width={width}
        height={height}
        offsetX={width / 2}
        offsetY={height / 2}
        align="center"
        verticalAlign="middle"
        visible={!isEditing}
      />
    </Group>
  );
}
