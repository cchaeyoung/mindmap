import { createClient } from '@/lib/supabase/client';
import { useMapStore } from '@/store/mapStore';
import { Edge, MindmapNode } from '@/types';
import { useEffect, useState } from 'react';

const DEBOUNCE_MS = 500;

type SaveStatus = 'idle' | 'saved' | 'error';

let pendingFlush: (() => Promise<void>) | null = null;

export async function flushAutoSave() {
  if (pendingFlush) {
    await pendingFlush();
    pendingFlush = null;
  }
}

export function useAutoSave(mapId: string | null) {
  const [saveState, setSaveState] = useState<{ mapId: string | null; status: SaveStatus }>({
    mapId: null,
    status: 'idle',
  });

  const status = saveState.mapId === mapId ? saveState.status : 'idle';

  useEffect(() => {
    if (!mapId) return;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let isFirstChange = true;
    let isRollingBack = false;
    let snapshot: { nodes: MindmapNode[]; edges: Edge[] } | null = null;

    const save = async () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      pendingFlush = null;
      const { nodes, edges } = useMapStore.getState();
      const { error } = await createClient().from('maps').update({ nodes, edges }).eq('id', mapId);
      if (error) {
        if (snapshot) {
          isRollingBack = true;
          useMapStore.getState().loadMap(snapshot.nodes, snapshot.edges);
        }
      } else {
        snapshot = { nodes, edges };
      }
      setSaveState({ mapId, status: error ? 'error' : 'saved' });
    };

    const unsubscribe = useMapStore.subscribe((state, prevState) => {
      if (state.nodes === prevState.nodes && state.edges === prevState.edges) return;
      if (isFirstChange) {
        isFirstChange = false;
        snapshot = { nodes: state.nodes, edges: state.edges };
        return;
      }
      if (isRollingBack) {
        isRollingBack = false;
        return;
      }
      if (debounceTimer) clearTimeout(debounceTimer);
      pendingFlush = save;
      debounceTimer = setTimeout(save, DEBOUNCE_MS);
    });

    const handleBeforeUnload = () => {
      flushAutoSave();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      unsubscribe();
      if (debounceTimer) clearTimeout(debounceTimer);
      if (pendingFlush) pendingFlush();
      pendingFlush = null;
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [mapId]);

  return { status };
}
