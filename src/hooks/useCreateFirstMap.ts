import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { useMapStore } from '@/store/mapStore';
import { MindmapListItem } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function useCreateFirstMap() {
  const user = useAuthStore((s) => s.user);
  const justAddedNodeId = useMapStore((s) => s.justAddedNodeId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const savedRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!user || savedRef.current) return;
    const { nodes, edges } = useMapStore.getState();
    if (nodes.length === 0) return;
    savedRef.current = true;
    createClient()
      .from('maps')
      .insert({ user_id: user.id, title: '새 마인드맵', nodes, edges })
      .select('id, title, updated_at, created_at, user_id')
      .single()
      .then(({ data }) => {
        if (!data) return;
        queryClient.setQueryData(['maps', user.id], (old: MindmapListItem[] = []) => [
          data as MindmapListItem,
          ...old,
        ]);
        queryClient.invalidateQueries({ queryKey: ['maps', user.id] });
        if (mountedRef.current) router.push(`/map/${data.id}`);
      });
  }, [user, justAddedNodeId, router, queryClient]);
}
