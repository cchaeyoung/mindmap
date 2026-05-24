'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function useErrorToast() {
  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get('error');
    if (!error) return;
    const t = setTimeout(() => {
      history.replaceState(null, '', '/');
      if (error === 'oauth') {
        toast.error('로그인에 실패했습니다. 다시 시도해주세요.', { id: 'oauth-error' });
      } else if (error === 'map-not-found') {
        toast.error('존재하지 않거나 삭제된 마인드맵입니다.', { id: 'map-not-found' });
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);
}
