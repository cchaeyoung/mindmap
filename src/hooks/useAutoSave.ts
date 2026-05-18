import { createClient } from '@/lib/supabase/client';
import { useMapStore } from '@/store/mapStore';
import { useEffect } from 'react';

const DEBOUNCE_MS = 500;

export function useAutoSave(mapId: string | null) {
  useEffect(() => {
    if (!mapId) return;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const unsubscribe = useMapStore.subscribe((state, prevState) => {
      if (state.nodes === prevState.nodes && state.edges === prevState.edges) return;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        createClient()
          .from('maps')
          .update({ nodes: state.nodes, edges: state.edges })
          .eq('id', mapId)
          .then();
      }, DEBOUNCE_MS);
    });

    return () => {
      unsubscribe();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [mapId]);
}
