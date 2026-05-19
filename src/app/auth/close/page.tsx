'use client';

import { useEffect } from 'react';

export default function Close() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ type: 'OAUTH_COMPLETE' }, window.location.origin);
      window.close();
    } else {
      window.location.href = '/';
    }
  }, []);

  return null;
}
