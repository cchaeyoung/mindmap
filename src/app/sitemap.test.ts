import { describe, it, expect } from 'vitest';
import sitemap from './sitemap';
import { SITE_URL } from '@/constants/site';

describe('sitemap', () => {
  it('홈페이지 URL을 포함한다', () => {
    const result = sitemap();
    expect(result[0].url).toBe(SITE_URL);
  });

  it('priority가 1이다', () => {
    const result = sitemap();
    expect(result[0].priority).toBe(1);
  });

  it('changeFrequency가 monthly이다', () => {
    const result = sitemap();
    expect(result[0].changeFrequency).toBe('monthly');
  });
});
