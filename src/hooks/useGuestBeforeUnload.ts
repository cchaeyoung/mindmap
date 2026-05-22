import { useEffect } from 'react';
import { useMapStore } from '@/store/mapStore';
import { useAuthStore } from '@/store/authStore';

export function useGuestBeforeUnload() {
  const nodes = useMapStore((state) => state.nodes);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user && nodes.length > 0) {
      const handler = (e: BeforeUnloadEvent) => {
        e.preventDefault();
      };
      window.addEventListener('beforeunload', handler);
      return () => window.removeEventListener('beforeunload', handler);
    }
  }, [user, nodes.length]);
}
