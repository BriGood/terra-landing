// Custom next/image loader.
//
// Our deploy target (Cloudflare Workers via @opennextjs/cloudflare) does NOT run
// the built-in Next image optimizer unless an `IMAGES` binding is configured —
// without it, `/_next/image` fetches the full-resolution original and returns it
// unoptimized. Instead of paying for Cloudflare Images, we let Shopify's CDN do
// the work: it resizes on the fly via `?width=` and auto-negotiates WebP/AVIF
// from the `Accept` header, served from its global edge cache.
//
// Local /Branding assets get none of that, so anything large enough to matter is
// pre-rendered to WebP at each of next.config's `deviceSizes` and mapped below.
// Local files with no entry here are passed through untouched — fine for the
// SVG logos and wordmarks, which are already tiny and resolution-independent.

type LoaderArgs = { src: string; width: number; quality?: number };

// Must stay in sync with `images.deviceSizes` in next.config.ts: next/image asks
// the loader for exactly those widths when building a srcset, and every one has
// to resolve to a file that exists.
const RESPONSIVE_WIDTHS = [640, 828, 1080, 1920];

// Source path -> basename under /Branding/responsive/.
// Regenerate variants if the source changes; see the commit that added this.
const LOCAL_RESPONSIVE: Record<string, string> = {
  '/Branding/HomeBanner.jpg': 'HomeBanner',
};

export default function shopifyImageLoader({ src, width }: LoaderArgs): string {
  if (src.startsWith('https://cdn.shopify.com')) {
    const url = new URL(src);
    url.searchParams.set('width', String(width));
    return url.href;
  }

  const basename = LOCAL_RESPONSIVE[src];
  if (basename) {
    const closest =
      RESPONSIVE_WIDTHS.find((candidate) => candidate >= width) ??
      RESPONSIVE_WIDTHS[RESPONSIVE_WIDTHS.length - 1];
    return `/Branding/responsive/${basename}-${closest}.webp`;
  }

  return src;
}
