import Image from 'next/image';
import Link from 'next/link';
import { getProducts, formatPrice } from '@/lib/shopify';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="bg-black text-white px-6 pt-14 pb-24 lg:px-20">
      <Breadcrumbs crumbs={[{ label: 'HØme', href: '/' }, { label: 'ShØp' }]} />
      <h1 className="text-4xl font-extrabold uppercase tracking-tight mb-12">ShØp</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.handle}`}
            className="group flex flex-col"
          >
            <div className="relative aspect-[4/3] bg-[#111] overflow-hidden mb-3">
              {product.featuredImage && (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <p className="text-xs uppercase tracking-widest text-[#888888] mb-1">{product.vendor}</p>
            <h2 className="font-bold uppercase tracking-tight mb-1">{product.title}</h2>
            <div className="flex items-center gap-2">
              <p className="text-white">
                {formatPrice(
                  product.priceRange.minVariantPrice.amount,
                  product.priceRange.minVariantPrice.currencyCode
                )}
              </p>
              {product.compareAtPriceRange?.minVariantPrice &&
                parseFloat(product.compareAtPriceRange.minVariantPrice.amount) >
                parseFloat(product.priceRange.minVariantPrice.amount) && (
                <p className="text-[#888888] line-through text-sm">
                  {formatPrice(
                    product.compareAtPriceRange.minVariantPrice.amount,
                    product.compareAtPriceRange.minVariantPrice.currencyCode
                  )}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
