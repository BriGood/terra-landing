import { notFound } from 'next/navigation';
import { getProduct, formatPrice } from '@/lib/shopify';
import ProductImageCarousel from '@/app/components/ProductImageCarousel';
import AddToCart from '@/app/components/AddToCart';

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
    <main className="min-h-screen bg-black text-white px-6 pt-8 pb-40 lg:px-20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">

        {/* Images */}
        <ProductImageCarousel images={product.images} title={product.title} />

        {/* Details */}
        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-widest text-[#888888] mb-1">Terra Fieldworks</p>
          <h1 className="text-3xl font-extrabold uppercase tracking-widest mb-4">
            {product.title}
          </h1>
          <p className="text-2xl font-bold mb-6">{price}</p>

          {product.descriptionHtml && (
            <div
              className="text-[#888888] mb-8 leading-snug [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}

          <AddToCart
            merchandiseId={firstVariant?.id ?? ''}
            availableForSale={firstVariant?.availableForSale ?? false}
            checkoutUrl={`https://${process.env.SHOPIFY_STORE_DOMAIN}/cart/${firstVariant?.id.split('/').pop()}:1`}
          />
        </div>

      </div>
    </main>
  );
}
