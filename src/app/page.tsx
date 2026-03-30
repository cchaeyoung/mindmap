'use client';

import AppLayout from '@/components/layout/AppLayout';
import MindmapCanvas from '@/components/canvas/MindmapCanvas';
import ZoomControls from '@/components/canvas/ZoomControls';
import { useCanvas } from '@/hooks/useCanvas';

export default function Home() {
  const { cam, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, zoomBy } = useCanvas();

  return (
    <AppLayout>
      <MindmapCanvas
        cam={cam}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <ZoomControls zoom={cam.zoom} zoomBy={zoomBy} />
    </AppLayout>
  );
}
