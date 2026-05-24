import Image from 'next/image';
import Link from 'next/link';
import { getProducts, formatPrice } from '@/lib/shopify';

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-black text-white px-6 pt-8 pb-24 lg:px-20">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight mb-12">ShØp</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.handle}`}
            className="group flex flex-col"
          >
            <div className="relative aspect-square bg-[#111] overflow-hidden mb-4">
              {product.featuredImage && (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <h2 className="font-bold uppercase tracking-tight mb-1">{product.title}</h2>
            <p className="text-[#888888]">
              {formatPrice(
                product.priceRange.minVariantPrice.amount,
                product.priceRange.minVariantPrice.currencyCode
              )}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
