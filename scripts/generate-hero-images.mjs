// Generates the responsive hero variants committed under
// public/Branding/responsive/.
//
// Local /Branding assets are served straight off the ASSETS binding — the Next
// image optimizer does not run on Cloudflare Workers without an IMAGES binding
// (see lib/shopify-image-loader.ts), so nothing resizes or re-encodes these at
// request time. They are built here and committed.
//
// Run after replacing either hero master:  npm run images
//
// Widths never exceed the source: upscaling adds bytes and no detail.

import sharp from 'sharp';
import { mkdir, readdir, unlink } from 'node:fs/promises';
import { statSync } from 'node:fs';
import path from 'node:path';

const OUT = 'public/Branding/responsive';

const SOURCES = [
  // Desktop art direction, shown at >=768px. 2560/3000 cover 2x laptops.
  { src: 'public/Branding/Hero_Desktop.jpg', name: 'hero-desktop', widths: [1280, 1920, 2560, 3000] },
  // Mobile art direction, shown below 768px. 1200 covers a 390px phone at 3x.
  { src: 'public/Branding/Hero_Mobile.jpg', name: 'hero-mobile', widths: [640, 828, 1200] },
];

// AVIF carries this image far better than WebP does (measured on the previous
// banner: WebP actually lost to a good JPEG on dense texture), so AVIF is the
// primary and WebP is the compatibility fallback.
const FORMATS = [
  { ext: 'avif', encode: (p) => p.avif({ quality: 55 }) },
  { ext: 'webp', encode: (p) => p.webp({ quality: 78 }) },
];

await mkdir(OUT, { recursive: true });

// Clear previously generated files so a renamed or dropped source can't leave
// orphans behind that the markup still points at.
for (const file of await readdir(OUT)) {
  await unlink(path.join(OUT, file));
}

for (const { src, name, widths } of SOURCES) {
  const meta = await sharp(src).metadata();
  console.log(`\n${src}  ${meta.width}x${meta.height}  (${(meta.width / meta.height).toFixed(2)}:1)`);

  for (const width of widths) {
    if (width > meta.width) {
      console.log(`  skip ${width}w — wider than the source`);
      continue;
    }
    for (const { ext, encode } of FORMATS) {
      const out = path.join(OUT, `${name}-${width}.${ext}`);
      await encode(sharp(src).resize(width)).toFile(out);
      console.log(`  ${path.basename(out).padEnd(26)} ${(statSync(out).size / 1024).toFixed(0).padStart(5)} KB`);
    }
  }
}
