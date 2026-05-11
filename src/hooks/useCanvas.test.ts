import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCanvas } from './useCanvas';
import { useCanvasStore } from '@/store/canvasStore';
import { ZOOM_MIN, ZOOM_MAX } from '@/constants/canvas';

beforeEach(() => {
  useCanvasStore.setState({ cam: { x: 0, y: 0, zoom: 1 } });
});

describe('zoomBy', () => {
  it('줌을 증가시킨다', () => {
    const { result } = renderHook(() => useCanvas());
    act(() => result.current.zoomBy(0.1, 0, 0));
    expect(useCanvasStore.getState().cam.zoom).toBeCloseTo(1.1);
  });

  it('줌을 감소시킨다', () => {
    const { result } = renderHook(() => useCanvas());
    act(() => result.current.zoomBy(-0.1, 0, 0));
    expect(useCanvasStore.getState().cam.zoom).toBeCloseTo(0.9);
  });

  it('ZOOM_MAX를 초과하지 않는다', () => {
    const { result } = renderHook(() => useCanvas());
    act(() => result.current.zoomBy(100, 0, 0));
    expect(useCanvasStore.getState().cam.zoom).toBe(ZOOM_MAX);
  });

  it('ZOOM_MIN 미만으로 내려가지 않는다', () => {
    const { result } = renderHook(() => useCanvas());
    act(() => result.current.zoomBy(-100, 0, 0));
    expect(useCanvasStore.getState().cam.zoom).toBe(ZOOM_MIN);
  });
});
