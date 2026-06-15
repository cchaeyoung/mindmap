import { ZOOM_MAX, ZOOM_MIN } from '@/constants/canvas';
import { useCanvasStore } from '@/store/canvasStore';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';
import { useRef } from 'react';

const SYNC_DELAY = 150;

export function useCanvas() {
  const cam = useCanvasStore((state) => state.cam);
  const setCam = useCanvasStore((state) => state.setCam);
  const setDisplayZoom = useCanvasStore((state) => state.setDisplayZoom);
  const stageRef = useRef<Konva.Stage>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncCam = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const { x, y } = stage.position();
    setCam({ x, y, zoom: stage.scaleX() });
  };

  const scheduleSync = () => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(syncCam, SYNC_DELAY);
  };

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;

    if (e.evt.ctrlKey || e.evt.metaKey) {
      const factor = e.evt.deltaY > 0 ? 0.9 : 1.1;
      const cx = e.evt.offsetX;
      const cy = e.evt.offsetY;
      if (stage) {
        const currentZoom = stage.scaleX();
        const { x, y } = stage.position();
        const newZoom = Math.min(Math.max(currentZoom * factor, ZOOM_MIN), ZOOM_MAX);
        const newX = cx - (cx - x) * (newZoom / currentZoom);
        const newY = cy - (cy - y) * (newZoom / currentZoom);
        stage.scale({ x: newZoom, y: newZoom });
        stage.position({ x: newX, y: newY });
        stage.batchDraw();
        setDisplayZoom(newZoom);
        scheduleSync();
      } else {
        setCam((prev) => {
          const newZoom = Math.min(Math.max(prev.zoom * factor, ZOOM_MIN), ZOOM_MAX);
          return {
            x: cx - (cx - prev.x) * (newZoom / prev.zoom),
            y: cy - (cy - prev.y) * (newZoom / prev.zoom),
            zoom: newZoom,
          };
        });
      }
    } else if (e.evt.shiftKey) {
      if (stage) {
        const { x, y } = stage.position();
        stage.position({ x: x - e.evt.deltaY, y });
        stage.batchDraw();
        scheduleSync();
      } else {
        setCam((prev) => ({ ...prev, x: prev.x - e.evt.deltaY }));
      }
    } else {
      if (stage) {
        const { x, y } = stage.position();
        stage.position({ x: x - e.evt.deltaX, y: y - e.evt.deltaY });
        stage.batchDraw();
        scheduleSync();
      } else {
        setCam((prev) => ({ ...prev, x: prev.x - e.evt.deltaX, y: prev.y - e.evt.deltaY }));
      }
    }
  };

  // 드래그 시작
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return;
    isDragging.current = true;
    lastPos.current = { x: e.evt.clientX, y: e.evt.clientY };
  };

  // 팬
  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDragging.current) return;
    const dx = e.evt.clientX - lastPos.current.x;
    const dy = e.evt.clientY - lastPos.current.y;
    const stage = stageRef.current;
    if (stage) {
      const { x, y } = stage.position();
      stage.position({ x: x + dx, y: y + dy });
      stage.batchDraw();
    } else {
      setCam((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    }
    lastPos.current = { x: e.evt.clientX, y: e.evt.clientY };
  };

  // 드래그 종료
  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    syncCam();
  };

  // +/- 버튼
  const zoomBy = (delta: number, cx: number, cy: number) => {
    const stage = stageRef.current;
    if (stage) {
      const currentZoom = stage.scaleX();
      const { x, y } = stage.position();
      const newZoom = Math.min(Math.max(currentZoom + delta, ZOOM_MIN), ZOOM_MAX);
      const newX = cx - (cx - x) * (newZoom / currentZoom);
      const newY = cy - (cy - y) * (newZoom / currentZoom);
      stage.scale({ x: newZoom, y: newZoom });
      stage.position({ x: newX, y: newY });
      stage.batchDraw();
      setCam({ x: newX, y: newY, zoom: newZoom });
    } else {
      setCam((prev) => {
        const newZoom = Math.min(Math.max(prev.zoom + delta, ZOOM_MIN), ZOOM_MAX);
        return {
          zoom: newZoom,
          x: cx - (cx - prev.x) * (newZoom / prev.zoom),
          y: cy - (cy - prev.y) * (newZoom / prev.zoom),
        };
      });
    }
  };

  return { cam, stageRef, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, zoomBy };
}
