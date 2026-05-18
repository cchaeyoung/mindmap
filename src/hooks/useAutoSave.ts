import { createClient } from '@/lib/supabase/client';
import { useMapStore } from '@/store/mapStore';
import { useEffect, useState } from 'react';

const DEBOUNCE_MS = 500;

type SaveStatus = 'idle' | 'saved' | 'error';

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

    const unsubscribe = useMapStore.subscribe((state, prevState) => {
      if (state.nodes === prevState.nodes && state.edges === prevState.edges) return;
      if (isFirstChange) {
        isFirstChange = false;
        return;
      }
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        createClient()
          .from('maps')
          .update({ nodes: state.nodes, edges: state.edges })
          .eq('id', mapId)
          .then(({ error }) => {
            setSaveState({ mapId, status: error ? 'error' : 'saved' });
          });
      }, DEBOUNCE_MS);
    });

    return () => {
      unsubscribe();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [mapId]);

  return { status };
}
