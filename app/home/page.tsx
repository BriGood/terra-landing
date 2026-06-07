import Image from 'next/image';
import Link from 'next/link';
import { getProducts, formatPrice } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="bg-black text-white">

      {/* Hero — full-width banner with text overlay */}
      <section className="relative w-full h-[25vh] lg:h-[34vh] overflow-hidden">
        <Image
          src="/Branding/HomeBanner.jpg"
          alt="Terra Fieldworks"
          fill
          className="object-cover object-[center_40%]"
          priority
        />
        <div className="absolute inset-0 flex items-center px-6 lg:px-20">
          <h1 className="text-[2.5rem] lg:text-[100px] font-extrabold uppercase tracking-tight leading-none">
            <span className="block">User Driven.</span>
            <span className="block">Purpose Built.</span>
          </h1>
        </div>
      </section>


      {/* Featured Products */}
      {products.length > 0 && (
        <section className="px-6 py-16 lg:px-20 border-t border-[#222]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs uppercase tracking-widest text-[#888888]">Featured</h2>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
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
                <h3 className="font-bold uppercase tracking-tight mb-1">{product.title}</h3>
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
        </section>
      )}

    </main>
  );
}
