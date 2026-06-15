'use client';

import AppLayout from '@/components/layout/AppLayout';
import MindmapCanvas from '@/components/canvas/MindmapCanvas';
import ZoomControls from '@/components/canvas/ZoomControls';
import Toolbar from '@/components/canvas/Toolbar';
import { useCanvas } from '@/hooks/useCanvas';
import { useCreateFirstMap } from '@/hooks/useCreateFirstMap';
import { useMapStore } from '@/store/mapStore';
import { useLayoutEffect } from 'react';
import EmptyCanvasHint from '@/components/canvas/EmptyCanvasHint';
import { useGuestBeforeUnload } from '@/hooks/useGuestBeforeUnload';
import { useErrorToast } from '@/hooks/useErrorToast';

export default function Home() {
  const { stageRef, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, zoomBy } =
    useCanvas();

  useLayoutEffect(() => {
    useMapStore.getState().loadMap([], []);
  }, []);
  useCreateFirstMap();
  useGuestBeforeUnload();
  useErrorToast();

  return (
    <AppLayout>
      <MindmapCanvas
        stageRef={stageRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <EmptyCanvasHint />
      <ZoomControls zoomBy={zoomBy} />
      <Toolbar />
    </AppLayout>
  );
}
