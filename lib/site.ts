// Canonical, absolute base URL for the production site. Used by metadataBase,
// the sitemap, robots, and JSON-LD where Next's relative resolution doesn't apply.
// Override via NEXT_PUBLIC_SITE_URL on preview deployments if you ever want them
// to self-reference instead of pointing at production.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://terrafieldworks.com'
).replace(/\/$/, '');
