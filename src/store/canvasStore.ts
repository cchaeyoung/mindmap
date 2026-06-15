import { create } from 'zustand';

interface Cam {
  x: number;
  y: number;
  zoom: number;
}

interface CanvasStore {
  cam: Cam;
  setCam: (updater: Cam | ((prev: Cam) => Cam)) => void;
  displayZoom: number;
  setDisplayZoom: (zoom: number) => void;
  stageSize: { width: number; height: number };
  setStageSize: (size: { width: number; height: number }) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  cam: { x: 0, y: 0, zoom: 1 },
  setCam: (updater) =>
    set((state) => {
      const newCam = typeof updater === 'function' ? updater(state.cam) : updater;
      return { cam: newCam, displayZoom: newCam.zoom };
    }),
  displayZoom: 1,
  setDisplayZoom: (zoom) => set({ displayZoom: zoom }),
  stageSize: { width: 0, height: 0 },
  setStageSize: (size) => set({ stageSize: size }),
}));
