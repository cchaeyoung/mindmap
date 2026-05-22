import { describe, it, expect } from 'vitest';
import robots from './robots';
import { SITE_URL } from '@/constants/site';

describe('robots', () => {
  it('/map/ 경로를 disallow한다', () => {
    const result = robots();
    expect(result.rules).toMatchObject({ disallow: '/map/' });
  });

  it('/ 경로를 allow한다', () => {
    const result = robots();
    expect(result.rules).toMatchObject({ allow: '/' });
  });

  it('sitemap URL을 포함한다', () => {
    const result = robots();
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
