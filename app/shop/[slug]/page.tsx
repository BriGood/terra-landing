import { notFound } from 'next/navigation';
import { getProduct, formatPrice } from '@/lib/shopify';
import ProductImageCarousel from '@/app/components/ProductImageCarousel';
import AddToCart from '@/app/components/AddToCart';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const firstVariant = product.variants[0];
  const price = formatPrice(firstVariant.price.amount, firstVariant.price.currencyCode);
  const compareAtPrice = firstVariant.compareAtPrice &&
    parseFloat(firstVariant.compareAtPrice.amount) > parseFloat(firstVariant.price.amount)
      ? formatPrice(firstVariant.compareAtPrice.amount, firstVariant.compareAtPrice.currencyCode)
      : null;

  return (
    <main className="min-h-screen bg-black text-white px-6 pt-14 pb-40 lg:px-20">
      <div className="max-w-5xl mx-auto">
      <Breadcrumbs crumbs={[{ label: 'HØme', href: '/' }, { label: 'ShØp', href: '/shop' }, { label: product.title }]} />
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">

        {/* Images */}
        <ProductImageCarousel images={product.images} title={product.title} />

        {/* Details */}
        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-widest text-[#888888] mb-1">{product.vendor}</p>
          <h1 className="text-3xl font-extrabold uppercase tracking-widest mb-4">
            {product.title}
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <p className="text-2xl font-bold">{price}</p>
            {compareAtPrice && (
              <p className="text-lg text-[#888888] line-through">{compareAtPrice}</p>
            )}
          </div>

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
            storeDomain={process.env.SHOPIFY_STORE_DOMAIN ?? ''}
          />
        </div>

      </div>
    </main>
  );
}
