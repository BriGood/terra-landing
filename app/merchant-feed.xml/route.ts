import { getAllProductsForFeed, type FeedProduct, type FeedVariant } from '@/lib/shopify';
import { SITE_URL } from '@/lib/site';

// Merchant Center fetches on its own daily schedule, so hourly is ample: a price
// or stock edit in Shopify reaches Google on its next pull either way, and this
// keeps the Storefront API from being hit on every request.
export const revalidate = 3600;

const BRAND = 'Terra Fieldworks';

// Shopify's weight units vs the unit codes Google accepts.
const WEIGHT_UNITS: Record<string, string> = {
  GRAMS: 'g',
  KILOGRAMS: 'kg',
  OUNCES: 'oz',
  POUNDS: 'lb',
};

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function tag(name: string, value: string): string {
  return `      <${name}>${esc(value)}</${name}>`;
}

function money(m: { amount: string; currencyCode: string }): string {
  return `${parseFloat(m.amount).toFixed(2)} ${m.currencyCode}`;
}

function variantItem(product: FeedProduct, variant: FeedVariant): string {
  const option = (name: string) =>
    variant.selectedOptions.find((o) => o.name.toLowerCase() === name)?.value ?? null;

  // Shopify names the lone variant of a single-variant product "Default Title";
  // it's an internal placeholder, not something to show a shopper.
  const variantLabel = variant.title && variant.title !== 'Default Title' ? variant.title : null;
  const title = variantLabel ? `${product.title} — ${variantLabel}` : product.title;

  // Google reads `price` as the regular price and `sale_price` as what's being
  // charged now, so a discounted variant sends compare-at as the former.
  const onSale =
    variant.compareAtPrice &&
    parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount);

  const lines: string[] = [
    tag('g:id', variant.id),
    tag('g:item_group_id', product.id),
    tag('title', title),
    tag('description', product.description || product.title),
    // Every variant points at the product page: it has no per-variant URL, so a
    // ?variant= parameter would be a link to a page that ignores it.
    tag('link', `${SITE_URL}/shop/${product.handle}`),
    tag('g:condition', 'new'),
    tag('g:brand', BRAND),
    tag('g:availability', variant.availableForSale ? 'in_stock' : 'out_of_stock'),
    tag('g:price', money(onSale ? variant.compareAtPrice! : variant.price)),
  ];

  if (onSale) lines.push(tag('g:sale_price', money(variant.price)));

  if (product.images[0]) lines.push(tag('g:image_link', product.images[0].url));
  for (const image of product.images.slice(1, 11)) {
    lines.push(tag('g:additional_image_link', image.url));
  }

  // No barcodes on the Storefront API and no SKUs set, so there is no GTIN or
  // MPN to send. Declaring that explicitly is what keeps the items eligible.
  if (variant.sku) {
    lines.push(tag('g:mpn', variant.sku));
  } else {
    lines.push(tag('g:identifier_exists', 'no'));
  }

  const color = option('color');
  if (color) lines.push(tag('g:color', color));
  const size = option('size');
  if (size) lines.push(tag('g:size', size));

  if (product.productType) lines.push(tag('g:product_type', product.productType));

  const unit = variant.weightUnit ? WEIGHT_UNITS[variant.weightUnit] : null;
  if (variant.weight && unit) lines.push(tag('g:shipping_weight', `${variant.weight} ${unit}`));

  return `    <item>\n${lines.join('\n')}\n    </item>`;
}

export async function GET() {
  const products = await getAllProductsForFeed();

  const items = products.flatMap((product) =>
    product.variants.map((variant) => variantItem(product, variant))
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${esc(BRAND)}</title>
    <link>${SITE_URL}</link>
    <description>Rugged tools, gear, and everyday carry — engineered for the field.</description>
${items.join('\n')}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
