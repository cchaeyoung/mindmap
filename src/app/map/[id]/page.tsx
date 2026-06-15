'use client';

import AppLayout from '@/components/layout/AppLayout';
import MindmapCanvas from '@/components/canvas/MindmapCanvas';
import ZoomControls from '@/components/canvas/ZoomControls';
import Toolbar from '@/components/canvas/Toolbar';
import { useCanvas } from '@/hooks/useCanvas';
import { useLoadMap } from '@/hooks/useLoadMap';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useUIStore } from '@/store/uiStore';
import SaveStatus from '@/components/canvas/SaveStatus';

export default function Home() {
  const { mapId } = useLoadMap();
  const { status } = useAutoSave(mapId);
  const { cam, stageRef, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, zoomBy } =
    useCanvas();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <AppLayout>
      <MindmapCanvas
        stageRef={stageRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <SaveStatus status={status} sidebarOpen={sidebarOpen} />
      <ZoomControls zoom={cam.zoom} zoomBy={zoomBy} />
      <Toolbar />
    </AppLayout>
  );
}
