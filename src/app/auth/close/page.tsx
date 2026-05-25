'use client';

import { useEffect } from 'react';

export default function Close() {
  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get('error');
    if (window.opener) {
      window.opener.postMessage({ type: 'OAUTH_COMPLETE', error }, window.location.origin);
      window.close();
    } else {
      window.location.href = error ? `/?error=${encodeURIComponent(error)}` : '/';
    }
  }, []);

  return null;
}
