'use client';

import { useEffect } from 'react';
import { useMapStore } from '@/store/mapStore';
import { useUIStore } from '@/store/uiStore';
import MindmapCanvas from '@/components/canvas/MindmapCanvas';
import ZoomControls from '@/components/canvas/ZoomControls';
import { useCanvas } from '@/hooks/useCanvas';
import { MindmapNode, Edge } from '@/types';

interface Props {
  nodes: MindmapNode[];
  edges: Edge[];
  title: string;
}

export default function ShareViewer({ nodes, edges, title }: Props) {
  const loadMap = useMapStore((s) => s.loadMap);
  const setCanvasMode = useUIStore((s) => s.setCanvasMode);
  const { stageRef, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, zoomBy } =
    useCanvas();

  useEffect(() => {
    loadMap(nodes, edges);
    setCanvasMode('hand');
  }, [nodes, edges, loadMap, setCanvasMode]);

  return (
    <div className="relative h-screen w-screen">
      <header className="bg-background absolute top-0 right-0 left-0 z-10 flex h-12 items-center border-b px-4">
        <span className="text-sm font-medium">{title}</span>
      </header>
      <div className="h-full pt-12">
        <MindmapCanvas
          stageRef={stageRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          readOnly
        />
      </div>
      <ZoomControls zoomBy={zoomBy} />
    </div>
  );
}
