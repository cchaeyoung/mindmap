import { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/map/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
