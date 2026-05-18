'use client';

import AppLayout from '@/components/layout/AppLayout';
import MindmapCanvas from '@/components/canvas/MindmapCanvas';
import ZoomControls from '@/components/canvas/ZoomControls';
import Toolbar from '@/components/canvas/Toolbar';
import { useCanvas } from '@/hooks/useCanvas';
import { useCreateFirstMap } from '@/hooks/useCreateFirstMap';
import { useMapStore } from '@/store/mapStore';
import { useLayoutEffect } from 'react';

export default function Home() {
  const { cam, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, zoomBy } = useCanvas();
  useLayoutEffect(() => {
    useMapStore.getState().loadMap([], []);
  }, []);
  useCreateFirstMap();

  return (
    <AppLayout>
      <MindmapCanvas
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <ZoomControls zoom={cam.zoom} zoomBy={zoomBy} />
      <Toolbar />
    </AppLayout>
  );
}
