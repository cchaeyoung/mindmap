import { NODE_SIZE_SCALE, NODE_STYLE } from '@/constants/node';
import { useNodeRefs } from '@/context/NodeRefsContext';
import { useCanvasStore } from '@/store/canvasStore';
import { useMapStore } from '@/store/mapStore';
import { useUIStore } from '@/store/uiStore';
import type { MindmapNode } from '@/types';
import { hexToRgba, resolveColorByTheme } from '@/utils/node';
import Konva from 'konva';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { Circle, Group, Rect, Text } from 'react-konva';

interface Props {
  node: MindmapNode;
  isSelected: boolean;
  isEditing: boolean;
}

export default function MindmapNode({ node, isSelected, isEditing }: Props) {
  const { resolvedTheme } = useTheme();
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const setEditingNode = useUIStore((state) => state.setEditingNode);
  const setIsDragging = useUIStore((state) => state.setIsDragging);
  const canvasMode = useUIStore((state) => state.canvasMode);
  const hoveredNodeId = useUIStore((state) => state.hoveredNodeId);
  const setDraggingNode = useUIStore((state) => state.setDraggingNode);
  const draggingNodeId = useUIStore((state) => state.draggingNodeId);
  const updateNode = useMapStore((state) => state.updateNode);
  const nodes = useMapStore((state) => state.nodes);
  const cam = useCanvasStore((state) => state.cam);
  const camRef = useRef(cam);
  useEffect(() => {
    camRef.current = cam;
  }, [cam]);
  const { nodeRefs, edgeRefs, registerNode, unregisterNode, addButtonRightRef, addButtonLeftRef } =
    useNodeRefs();
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

  const tier = node.parentId === null ? 'root' : 'child';
  const style = NODE_STYLE[tier];
  const isDark = resolvedTheme === 'dark';
  const scale = NODE_SIZE_SCALE[node.size ?? 'M'];
  const width = node.width;
  const height = style.fontSize * scale * 1.4 + style.paddingY * scale * 2;
  const radius = node.shape === 'pill' ? height / 2 : node.shape === 'round' ? 8 : 2;

  const isTransparent = node.colorIndex === 0;
  const accentStroke = isDark ? 'rgba(154,179,250,0.38)' : 'rgba(54,82,199,0.32)';
  const themedColor = resolveColorByTheme(node.colorIndex, isDark);

  const fillColor = isTransparent
    ? 'transparent'
    : tier === 'root'
      ? hexToRgba(themedColor, isDark ? 0.88 : 0.74)
      : hexToRgba(themedColor, isDark ? 0.16 : 0.11);

  const strokeColor = isTransparent
    ? accentStroke
    : tier === 'root'
      ? hexToRgba(themedColor, isSelected ? 1 : 0.82)
      : hexToRgba(themedColor, isSelected ? 0.98 : 0.58);

  const strokeWidth = isSelected ? (tier === 'root' ? 2.5 : 2) : tier === 'root' ? 2 : 1.4;

  const shadowBlur = isTransparent
    ? 0
    : tier === 'root'
      ? isSelected
        ? 24
        : 10
      : isSelected
        ? 12
        : 0;
  const shadowOpacity = tier === 'root' ? (isSelected ? 0.55 : 0.22) : isSelected ? 0.38 : 0;

  const textColor = node.textColor ?? (isDark ? 'rgba(255,255,255,0.9)' : 'rgba(14,12,42,0.92)');

  return (
    <Group
      ref={groupRef}
      x={node.x}
      y={node.y}
      draggable={canvasMode === 'select'}
      onClick={() => {
        if (canvasMode !== 'select') return;
        setSelectedNode(node.id);
      }}
      onDblClick={() => {
        if (canvasMode !== 'select') return;
        setSelectedNode(node.id);
        setEditingNode(node.id);
      }}
      onMouseDown={(e) => {
        if (canvasMode !== 'select') return;
        e.cancelBubble = true;
        if (!isSelected) setSelectedNode(null);
      }}
      onDragStart={(e) => {
        setIsDragging(true);
        setDraggingNode(node.id);
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
              const isLeft = nodeData.direction === 'left';
              const x1 = isLeft ? parentPos.x - fromWidth / 2 : parentPos.x + fromWidth / 2;
              const y1 = parentPos.y;
              const x2 = isLeft ? pos.x + toWidth / 2 : pos.x - toWidth / 2;
              const y2 = pos.y;
              const midX = x1 + (x2 - x1) * 0.5;
              const points = [x1, y1, midX, y1, midX, y2, x2, y2];
              edgeLines.forEach((line) => line.points(points));
            }
          }
        });

        if (isSelected || hoveredNodeId === node.id || draggingNodeId === node.id) {
          const c = camRef.current;
          const screenY = c.y + y * c.zoom;
          if (addButtonRightRef.current) {
            const screenX = c.x + (x + node.width / 2) * c.zoom + 21;
            addButtonRightRef.current.style.left = `${screenX}px`;
            addButtonRightRef.current.style.top = `${screenY}px`;
          }
          if (addButtonLeftRef.current) {
            const screenX = c.x + (x - node.width / 2) * c.zoom - 21;
            addButtonLeftRef.current.style.left = `${screenX}px`;
            addButtonLeftRef.current.style.top = `${screenY}px`;
          }
        }
      }}
      onDragEnd={(e) => {
        setIsDragging(false);
        setDraggingNode(null);

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
      {isSelected && tier === 'root' && (
        <Rect
          width={width + 7}
          height={height + 7}
          offsetX={(width + 7) / 2}
          offsetY={(height + 7) / 2}
          cornerRadius={radius + 3.5}
          stroke={isTransparent ? accentStroke : strokeColor}
          strokeWidth={1.5}
          opacity={0.4}
        />
      )}
      <Rect
        width={width}
        height={height}
        offsetX={width / 2}
        offsetY={height / 2}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        cornerRadius={radius}
        shadowColor={isTransparent ? 'transparent' : themedColor}
        shadowBlur={shadowBlur}
        shadowOpacity={shadowOpacity}
        shadowEnabled={shadowBlur > 0}
      />
      <Text
        text={node.label}
        fontSize={style.fontSize * scale}
        fontFamily="Pretendard, sans-serif"
        fontStyle={[
          node.italic && 'italic',
          node.bold ? (tier === 'root' ? '800' : 'bold') : String(style.fontWeight),
        ]
          .filter(Boolean)
          .join(' ')}
        textDecoration={[node.underline && 'underline', node.strikethrough && 'line-through']
          .filter(Boolean)
          .join(' ')}
        fill={textColor}
        width={width}
        height={height}
        offsetX={width / 2}
        offsetY={height / 2}
        align="center"
        verticalAlign="middle"
        visible={!isEditing}
      />
      {node.memo &&
        node.memo.trim() &&
        (() => {
          const rx = node.shape === 'pill' ? height / 2 : node.shape === 'sharp' ? 2 : 8;
          const dotR = 3.5;
          const gap = 4;
          const cornerCx = width / 2 - rx;
          const cornerCy = -height / 2 + rx;
          const dist = rx + dotR + gap;
          return (
            <Circle
              x={cornerCx + dist / Math.SQRT2}
              y={cornerCy - dist / Math.SQRT2}
              radius={dotR}
              fill={isDark ? 'rgba(154,179,250,.95)' : 'rgba(54,82,199,.85)'}
            />
          );
        })()}
    </Group>
  );
}
