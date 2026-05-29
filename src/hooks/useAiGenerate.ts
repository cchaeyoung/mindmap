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

  const addNodes = useMapStore((state) => state.addNodes);
  const applyAutoLayout = useMapStore((state) => state.applyAutoLayout);

  const handleGenerate = async (topic: string) => {
    setIsGenerating(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const idMap = new Map<string, string>();
      const nodes: MindmapNode[] = [];
      const edges: Edge[] = [];

      const { cam, stageSize } = useCanvasStore.getState();
      const rootX = (stageSize.width / 2 - cam.x) / cam.zoom;
      const rootY = (stageSize.height / 2 - cam.y) / cam.zoom;

      for (const n of data.nodes) {
        const id = crypto.randomUUID();
        idMap.set(n.aiId, id);
        const parentId = n.parentAiId ? (idMap.get(n.parentAiId) ?? null) : null;
        const tier = parentId === null ? 'root' : 'child';
        const size = 'M' as const;
        const isRoot = parentId === null;
        nodes.push({
          id,
          x: isRoot ? rootX : 0,
          y: isRoot ? rootY : 0,
          label: n.label,
          width: measureNodeWidth(n.label, tier, size),
          parentId,
          colorIndex: isRoot ? NODE_DEFAULT_COLOR_INDEX : 0,
          size,
          shape: 'pill',
          direction: n.direction,
        });
        if (parentId) {
          edges.push({ id: crypto.randomUUID(), fromId: parentId, toId: id });
        }
      }

      addNodes(nodes, edges);
      applyAutoLayout();
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      toast.error('AI 마인드맵 생성에 실패했습니다');
    } finally {
      setIsGenerating(false);
      abortRef.current = null;
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsGenerating(false);
  };

  return { isGenerating, handleGenerate, handleCancel };
}
