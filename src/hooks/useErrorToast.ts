'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function useErrorToast() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error === 'map-not-found') {
      toast.error('존재하지 않거나 삭제된 마인드맵입니다.', { id: 'map-not-found' });
      history.replaceState(null, '', '/');
    }
  }, []);
}
