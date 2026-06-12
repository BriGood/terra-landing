import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // User-specific and non-content routes — no SEO value, keep them out of the index.
      // /card is the QR redirect; it should never be indexed (the canonical home is "/").
      disallow: ['/cart', '/order/', '/api/', '/card'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
