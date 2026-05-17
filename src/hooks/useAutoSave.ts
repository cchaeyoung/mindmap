import { createClient } from '@/lib/supabase/client';
import { useMapStore } from '@/store/mapStore';
import { useEffect } from 'react';

export function useAutoSave(mapId: string | null) {
  useEffect(() => {
    if (!mapId) return;

    const unsubscribe = useMapStore.subscribe((state, prevState) => {
      if (state.nodes === prevState.nodes && state.edges === prevState.edges) return;
      createClient()
        .from('maps')
        .update({ nodes: state.nodes, edges: state.edges })
        .eq('id', mapId)
        .then();
    });

    return unsubscribe;
  }, [mapId]);
}
