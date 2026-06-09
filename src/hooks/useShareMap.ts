import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function useShareMap() {
  const params = useParams();
  const mapId = params.id as string;
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['map-share', mapId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('maps')
        .select('is_public')
        .eq('id', mapId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!mapId,
  });

  const mutation = useMutation({
    mutationFn: async (isPublic: boolean) => {
      const supabase = createClient();
      const { error } = await supabase.from('maps').update({ is_public: isPublic }).eq('id', mapId);
      if (error) throw error;
    },
    onSuccess: (_, isPublic) => {
      queryClient.setQueryData(['map-share', mapId], { is_public: isPublic });
    },
    onError: () => {
      toast.error('공유 설정에 실패했습니다');
    },
  });

  const copyLink = async () => {
    const url = `${window.location.origin}/share/${mapId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      toast.error('링크 복사에 실패했습니다');
    }
  };

  return {
    isPublic: data?.is_public ?? false,
    toggle: (value: boolean) => mutation.mutate(value),
    copyLink,
    isPending: mutation.isPending,
  };
}
