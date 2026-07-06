import { CULL_BUFFER } from '@/constants/canvas';
import { useNodeRefs } from '@/context/NodeRefsContext';
import { useCanvasStore } from '@/store/canvasStore';
import { useMapStore } from '@/store/mapStore';
import { useUIStore } from '@/store/uiStore';
import { useEffect } from 'react';

export function useCulling() {
  const { nodeRefs } = useNodeRefs();
  const cam = useCanvasStore((state) => state.cam);

  useEffect(() => {
    const { x: camX, y: camY, zoom } = cam;
    const { width: stageW, height: stageH } = useCanvasStore.getState().stageSize;

    const viewLeft = -camX / zoom - CULL_BUFFER;
    const viewRight = (stageW - camX) / zoom + CULL_BUFFER;
    const viewTop = -camY / zoom - CULL_BUFFER;
    const viewBottom = (stageH - camY) / zoom + CULL_BUFFER;

    const nodes = useMapStore.getState().nodes;
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const draggingNodeId = useUIStore.getState().draggingNodeId;

    nodeRefs.current.forEach((ref, id) => {
      if (id === draggingNodeId) return;

      const nodeData = nodeMap.get(id);
      if (!nodeData) return;

      const pos = ref.position();
      const halfW = nodeData.width / 2;
      const halfH = 40;

      const inView =
        pos.x + halfW > viewLeft &&
        pos.x - halfW < viewRight &&
        pos.y + halfH > viewTop &&
        pos.y - halfH < viewBottom;

      ref.visible(inView);
      ref.listening(inView);
    });
  }, [cam]);
}
