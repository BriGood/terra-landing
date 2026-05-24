import { notFound } from 'next/navigation';
import { getProduct, formatPrice } from '@/lib/shopify';
import ProductImageCarousel from '@/app/components/ProductImageCarousel';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const price = formatPrice(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode
  );

  const firstVariant = product.variants[0];

  return (
    <main className="min-h-screen bg-black text-white px-6 pt-8 pb-24 lg:px-20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Images */}
        <ProductImageCarousel images={product.images} title={product.title} />

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold uppercase tracking-tight mb-4">
            {product.title}
          </h1>
          <p className="text-2xl font-bold mb-6">{price}</p>

          {product.descriptionHtml && (
            <div
              className="text-[#888888] mb-8 leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}

          {/* Variant selector */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <p className="text-sm uppercase tracking-widest mb-3">Options</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    disabled={!variant.availableForSale}
                    className="px-4 py-2 border border-white text-sm uppercase tracking-wide disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:text-black transition-colors"
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Buy button */}
          <a
            href={`https://${process.env.SHOPIFY_STORE_DOMAIN}/cart/${firstVariant?.id.split('/').pop()}:1`}
            className="bg-white text-black text-sm font-bold uppercase tracking-widest px-8 py-4 text-center hover:bg-[#ccc] transition-colors"
          >
            {firstVariant?.availableForSale ? 'Buy Now' : 'Sold Out'}
          </a>
        </div>

      </div>
    </main>
  );
}
