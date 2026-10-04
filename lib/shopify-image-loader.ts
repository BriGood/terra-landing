// Custom next/image loader.
//
// Our deploy target (Cloudflare Workers via @opennextjs/cloudflare) does NOT run
// the built-in Next image optimizer unless an `IMAGES` binding is configured —
// without it, `/_next/image` fetches the full-resolution original and returns it
// unoptimized. Instead of paying for Cloudflare Images, we let Shopify's CDN do
// the work: it resizes on the fly via `?width=` and auto-negotiates WebP/AVIF
// from the `Accept` header, served from its global edge cache.
//
// Non-Shopify sources (local /Branding assets served by the ASSETS binding) are
// passed through untouched. That is fine for the SVG logos and wordmarks, which
// are tiny and resolution-independent. The hero is the one local image heavy
// enough to need real variants, and it does not come through here: it needs a
// different crop below 768px, which next/image cannot express, so it is a
// hand-written <picture> in app/page.tsx fed by `npm run images`.

type LoaderArgs = { src: string; width: number; quality?: number };

export default function shopifyImageLoader({ src, width }: LoaderArgs): string {
  if (!src.startsWith('https://cdn.shopify.com')) {
    return src;
  }
  const url = new URL(src);
  url.searchParams.set('width', String(width));
  return url.href;
}
