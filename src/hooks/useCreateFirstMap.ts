import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { useMapStore } from '@/store/mapStore';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useCreateFirstMap() {
  const user = useAuthStore((s) => s.user);
  const justAddedNodeId = useMapStore((s) => s.justAddedNodeId);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!justAddedNodeId || !user) return;
    const { nodes, edges } = useMapStore.getState();
    createClient()
      .from('maps')
      .insert({ user_id: user.id, title: '새 마인드맵', nodes, edges })
      .select('id')
      .single()
      .then(({ data }) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['maps', user.id] });
          router.push(`/map/${data.id}`);
        }
      });
  }, [justAddedNodeId, user, router, queryClient]);
}
