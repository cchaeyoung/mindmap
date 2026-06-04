import { useRef, useState } from 'react';
import { useMapStore } from '@/store/mapStore';
import { useCanvasStore } from '@/store/canvasStore';
import { measureNodeWidth } from '@/utils/node';
import { MindmapNode, Edge } from '@/types';
import { NODE_DEFAULT_COLOR_INDEX } from '@/constants/node';
import { toast } from 'sonner';

export function useAiGenerate() {
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const addedNodeIdsRef = useRef<string[]>([]);

  const addNodes = useMapStore((state) => state.addNodes);
  const deleteNodes = useMapStore((state) => state.deleteNodes);
  const applyAutoLayout = useMapStore((state) => state.applyAutoLayout);

  const handleGenerate = async (topic: string) => {
    setIsGenerating(true);
    const controller = new AbortController();
    abortRef.current = controller;

    addedNodeIdsRef.current = [];
    const idMap = new Map<string, string>();
    const directionMap = new Map<string, 'left' | 'right'>();
    const edges: Edge[] = [];
    const { cam, stageSize } = useCanvasStore.getState();
    const rootX = (stageSize.width / 2 - cam.x) / cam.zoom;
    const rootY = (stageSize.height / 2 - cam.y) / cam.zoom;

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            applyAutoLayout();
            return;
          }

          const n = JSON.parse(data);
          const id = crypto.randomUUID();
          idMap.set(n.aiId, id);
          const parentId = n.parentAiId ? (idMap.get(n.parentAiId) ?? null) : null;
          const isRoot = parentId === null;
          const tier = isRoot ? 'root' : 'child';
          const size = 'M' as const;

          const resolvedDirection: 'left' | 'right' | undefined = n.parentAiId
            ? (directionMap.get(n.parentAiId) ?? n.direction)
            : n.direction;
          if (resolvedDirection) directionMap.set(n.aiId, resolvedDirection);

          const node: MindmapNode = {
            id,
            x: isRoot ? rootX : 0,
            y: isRoot ? rootY : 0,
            label: n.label,
            width: measureNodeWidth(n.label, tier, size),
            parentId,
            colorIndex: isRoot ? NODE_DEFAULT_COLOR_INDEX : 0,
            size,
            shape: 'pill',
            direction: resolvedDirection,
          };

          if (parentId) {
            edges.push({ id: crypto.randomUUID(), fromId: parentId, toId: id });
          }

          addedNodeIdsRef.current.push(id);
          addNodes([node], parentId ? [edges[edges.length - 1]] : []);
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        deleteNodes(addedNodeIdsRef.current);
        addedNodeIdsRef.current = [];
        return;
      }
      toast.error('AI 마인드맵 생성에 실패했습니다');
    } finally {
      setIsGenerating(false);
      abortRef.current = null;
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
  };

  return { isGenerating, handleGenerate, handleCancel };
}
