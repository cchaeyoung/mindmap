'use client';

import AppLayout from '@/components/layout/AppLayout';
import MindmapCanvas from '@/components/canvas/MindmapCanvas';
import ZoomControls from '@/components/canvas/ZoomControls';
import Toolbar from '@/components/canvas/Toolbar';
import { useCanvas } from '@/hooks/useCanvas';
import { useLoadMap } from '@/hooks/useLoadMap';
import { useAutoSave } from '@/hooks/useAutoSave';

export default function Home() {
  const { mapId } = useLoadMap();
  useAutoSave(mapId);
  const { cam, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, zoomBy } = useCanvas();

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
