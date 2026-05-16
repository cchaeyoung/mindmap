'use client';

import IconButton from '@/components/common/IconButton';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { MindmapListItem } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LogOut, PanelLeftClose, PanelLeftOpen, Plus } from 'lucide-react';
import { useState } from 'react';
import MindmapItem from '@/components/sidebar/MindmapItem';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const fetchMaps = async (): Promise<MindmapListItem[]> => {
  const { data } = await createClient()
    .from('maps')
    .select('id, title, updated_at, created_at, user_id')
    .order('updated_at', { ascending: false });
  return (data as MindmapListItem[]) ?? [];
};

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const setAuthModalOpen = useAuthStore((state) => state.setAuthModalOpen);
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: maps = [] } = useQuery({
    queryKey: ['maps', user?.id],
    queryFn: fetchMaps,
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await createClient()
        .from('maps')
        .insert({ user_id: user!.id, title: '새 마인드맵', nodes: [], edges: [] })
        .select('id, title, updated_at, created_at, user_id')
        .single();
      if (error || !data) throw error;
      return data as MindmapListItem;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['maps', user?.id], (old: MindmapListItem[] = []) => [data, ...old]);
      setEditingId(data.id);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await createClient().from('maps').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maps', user?.id] }),
    onError: () => queryClient.invalidateQueries({ queryKey: ['maps', user?.id] }),
  });

  const renameMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const { error } = await createClient().from('maps').update({ title }).eq('id', id);
      if (error) throw error;
    },
    onMutate: ({ id, title }) => {
      const previous = queryClient.getQueryData<MindmapListItem[]>(['maps', user?.id]);
      queryClient.setQueryData(['maps', user?.id], (old: MindmapListItem[]) =>
        old.map((m) => (m.id === id ? { ...m, title } : m))
      );
      queryClient.cancelQueries({ queryKey: ['maps', user?.id] });
      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['maps', user?.id], context?.previous);
    },
  });

  const handleRenameConfirm = (id: string, title: string) => {
    const trimmed = title.trim();
    setEditingId(null);
    if (!trimmed) return;
    renameMutation.mutate({ id, title: trimmed });
  };

  const handleSignOut = async () => {
    try {
      await createClient().auth.signOut();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={onToggle}
          className="border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground fixed top-4.5 left-4.5 z-26 flex h-8.5 w-8.5 items-center justify-center rounded-[10px] border shadow-[0_2px_14px_var(--mm-shadow)] backdrop-blur-[28px] transition-all"
        >
          <PanelLeftOpen size={16} />
        </button>
      )}

      <aside
        className="border-sidebar-border bg-sidebar fixed top-0 left-0 z-55 flex h-screen w-60 flex-col border-r transition-transform duration-280"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(-240px)',
          transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)',
        }}
      >
        {/* 헤더 */}
        <div className="border-sidebar-border flex shrink-0 items-center border-b px-3 pt-3.25 pb-2.75">
          <span className="text-foreground flex-1 text-[13px] font-semibold">mindmap</span>
          <IconButton onClick={onToggle} className="h-7 w-7 rounded-lg">
            <PanelLeftClose size={16} />
          </IconButton>
        </div>

        {/* 맵 목록 */}
        <div className="flex shrink-0 items-center justify-between py-3.5 pr-3 pl-4">
          <span className="text-muted-foreground text-[10px] font-semibold tracking-[0.7px]">
            내 마인드맵
          </span>
          <IconButton
            onClick={() => createMutation.mutate()}
            className="hover:bg-primary/15 hover:text-primary h-5.5 w-5.5 rounded-[6px]"
          >
            <Plus size={14} />
          </IconButton>
        </div>

        <div
          className={`[&::-webkit-scrollbar-thumb]:bg-border flex-1 overflow-y-auto px-2 py-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full ${deleteMutation.isPending ? 'pointer-events-none' : ''}`}
        >
          {user &&
            maps.map((map) => (
              <MindmapItem
                key={map.id}
                map={map}
                isActive={false}
                isEditing={editingId === map.id}
                onClick={() => {}}
                onRenameStart={() => setEditingId(map.id)}
                onRename={handleRenameConfirm}
                onRenameCancel={() => setEditingId(null)}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
        </div>

        {/* 유저 영역 */}
        <div
          onClick={() => !user && setAuthModalOpen(true)}
          className={`border-sidebar-border flex shrink-0 items-center gap-2.5 border-t px-3.5 py-3 transition-all ${!user ? 'hover:bg-accent cursor-pointer' : ''}`}
        >
          <div className="border-primary/35 bg-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] text-[13px] font-semibold text-(--mm-acc-fg)">
            {user ? (user.email?.[0] ?? '?').toUpperCase() : '?'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-foreground truncate text-[12px] font-medium" title={user?.email}>
              {user ? user.email : '게스트'}
            </div>
            {!user && <div className="text-muted-foreground text-[10.5px]">로그인하기</div>}
          </div>
          {user && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSignOut();
              }}
              className="text-muted-foreground hover:bg-destructive/15 flex h-6.5 w-6.5 shrink-0 cursor-pointer items-center justify-center rounded-[7px] transition-all hover:text-red-400"
            >
              <LogOut size={13} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
