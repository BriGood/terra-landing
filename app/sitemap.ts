import type { MetadataRoute } from 'next';
import { getProducts, getCollections } from '@/lib/shopify';
import { SITE_URL } from '@/lib/site';

// Re-generate at most hourly so newly published/unpublished products are picked up
// without making the sitemap fully dynamic on every crawl.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([
    getProducts().catch(() => []),
    getCollections().catch(() => []),
  ]);

  const now = new Date();

  // Public, indexable routes. Excludes /cart and /order/* (user-specific) and the
  // /api/* handlers — those are also blocked in robots.ts.
  // Note: /home (the storefront) is intentionally excluded — "/" is the canonical
  // homepage. At launch, /home will redirect to "/" (which becomes the storefront).
  const staticRoutes: MetadataRoute.Sitemap = [
    { path: '/', priority: 1 },
    { path: '/shop', priority: 0.8 },
    { path: '/about', priority: 0.6 },
    { path: '/contact', priority: 0.5 },
    { path: '/faq', priority: 0.5 },
    { path: '/journal', priority: 0.5 },
  ].map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority,
  }));

  // Everything the Storefront API returns is already published to this sales
  // channel — drafts and unpublished products never come back from it — so the
  // list is safe to advertise in full. Out-of-stock products stay in: their pages
  // are 200, canonical and indexable, they carry accurate schema.org/OutOfStock
  // availability, and they capture demand through notify-me while restocking.
  // Dropping them from the sitemap only slowed discovery; it never protected
  // anything. In-stock products keep the higher priority so they stay the
  // stronger signal.
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/shop/${p.handle}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p.availableForSale ? 0.8 : 0.6,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${SITE_URL}/collections/${c.handle}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}
