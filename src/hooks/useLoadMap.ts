import { createClient } from '@/lib/supabase/client';
import { useMapStore } from '@/store/mapStore';
import { Edge, MindmapNode } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function useLoadMap() {
  const searchParams = useSearchParams();
  const mapId = searchParams.get('map');
  const loadMap = useMapStore((s) => s.loadMap);

  const { data, isLoading } = useQuery({
    queryKey: ['map', mapId],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('maps')
        .select('nodes, edges')
        .eq('id', mapId!)
        .single();
      if (error) throw error;
      return data as { nodes: MindmapNode[]; edges: Edge[] };
    },
    enabled: !!mapId,
  });

  useEffect(() => {
    if (data) loadMap(data.nodes, data.edges);
  }, [data, loadMap]);

  return { mapId, isLoading };
}
