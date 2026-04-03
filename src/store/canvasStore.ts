import { create } from 'zustand';

interface Cam {
  x: number;
  y: number;
  zoom: number;
}

interface CanvasStore {
  cam: Cam;
  setCam: (updater: Cam | ((prev: Cam) => Cam)) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  cam: { x: 0, y: 0, zoom: 1 },
  setCam: (updater) =>
    set((state) => ({
      cam: typeof updater === 'function' ? updater(state.cam) : updater,
    })),
}));
