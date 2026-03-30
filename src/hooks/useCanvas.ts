import { ZOOM_MAX, ZOOM_MIN } from '@/constants/canvas';
import { KonvaEventObject } from 'konva/lib/Node';
import { useRef, useState } from 'react';

interface Cam {
  x: number;
  y: number;
  zoom: number;
}

export function useCanvas() {
  const [cam, setCam] = useState<Cam>({ x: 0, y: 0, zoom: 1 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // ctrlKey 줌 / shiftKey 좌우 / 기본 상하
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    if (e.evt.ctrlKey || e.evt.metaKey) {
      const factor = e.evt.deltaY > 0 ? 0.9 : 1.1;
      const cx = e.evt.offsetX;
      const cy = e.evt.offsetY;
      setCam((prev) => {
        const newZoom = Math.min(Math.max(prev.zoom * factor, ZOOM_MIN), ZOOM_MAX);
        return {
          x: cx - (cx - prev.x) * (newZoom / prev.zoom),
          y: cy - (cy - prev.y) * (newZoom / prev.zoom),
          zoom: newZoom,
        };
      });
    } else if (e.evt.shiftKey) {
      setCam((prev) => ({ ...prev, x: prev.x - e.evt.deltaY }));
    } else {
      setCam((prev) => ({ ...prev, y: prev.y - e.evt.deltaY }));
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
    setCam((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    lastPos.current = { x: e.evt.clientX, y: e.evt.clientY };
  };

  // 드래그 종료
  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // +/- 버튼
  const zoomBy = (delta: number, cx: number, cy: number) => {
    setCam((prev) => {
      const newZoom = Math.min(Math.max(prev.zoom + delta, ZOOM_MIN), ZOOM_MAX);
      return {
        zoom: newZoom,
        x: cx - (cx - prev.x) * (newZoom / prev.zoom),
        y: cy - (cy - prev.y) * (newZoom / prev.zoom),
      };
    });
  };

  return {
    cam,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    zoomBy,
  };
}
