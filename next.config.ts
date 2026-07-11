import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Shopify's CDN handles resizing (?width=) and format negotiation (WebP/AVIF),
    // so we bypass the Next optimizer entirely. See lib/shopify-image-loader.ts for why.
    loader: 'custom',
    loaderFile: './lib/shopify-image-loader.ts',
    // Shopify generates each distinct width on the fly (~1s cold, then cached a year),
    // so keep the srcset candidate set small: fewer sizes to warm = higher cache-hit
    // rate for every visitor. These cover thumbnails, mobile/desktop, and lightbox.
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [64, 128, 256],
  },
};

export default nextConfig;
