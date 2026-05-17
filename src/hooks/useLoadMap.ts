import { createClient } from '@/lib/supabase/client';
import { useMapStore } from '@/store/mapStore';
import { Edge, MindmapNode } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useLoadMap() {
  const { id: mapId } = useParams<{ id: string }>();
  const loadMap = useMapStore((s) => s.loadMap);
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['map', mapId],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('maps')
        .select('nodes, edges')
        .eq('id', mapId!)
        .single();
      if (error) throw error;
      return {
        nodes: Array.isArray(data?.nodes) ? (data.nodes as MindmapNode[]) : [],
        edges: Array.isArray(data?.edges) ? (data.edges as Edge[]) : [],
      };
    },
    enabled: !!mapId,
    staleTime: 0,
  });

  useEffect(() => {
    if (data) loadMap(data.nodes, data.edges);
  }, [data, loadMap]);

  useEffect(() => {
    if (isError) router.replace('/');
  }, [isError, router]);

  return { mapId, isLoading };
}
