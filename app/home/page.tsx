import Image from 'next/image';
import Link from 'next/link';
import { getProducts, formatPrice } from '@/lib/shopify';

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="bg-black text-white">

      {/* Hero */}
      <section className="min-h-[60vh] grid grid-cols-1 lg:grid-cols-2">

        {/* Left: text + CTA */}
        <div className="flex flex-col items-start justify-start lg:justify-center px-6 pt-8 pb-10 lg:py-24 lg:px-20 order-last lg:order-first">
          <h1 className="text-4xl lg:text-7xl font-extrabold uppercase tracking-tight leading-none mb-6">
            <span className="block mb-2">User Driven.</span>
            <span className="block">Purpose Built.</span>
          </h1>
          <p className="text-[#888888] text-lg mb-10 max-w-sm">
            Innovative tools, gear, and everyday carry — engineered for the field.
          </p>
          <Link
            href="/shop"
            className="bg-white text-black text-sm font-bold uppercase tracking-widest px-8 py-4 hover:bg-[#ccc] transition-colors"
          >
            Shop Now
          </Link>
        </div>

        {/* Right: hero slideshow */}
        <div className="relative min-h-[26vh] lg:min-h-0 overflow-hidden order-first lg:order-last">
          <Image
            src="/Landing%20Page%20Images/LandingImage2.png"
            alt="Terra Fieldworks"
            fill
            className="object-cover object-right-bottom"
            priority
          />
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
                <p className="text-xs uppercase tracking-widest text-[#888888] mb-1">Terra Fieldworks</p>
                <h3 className="font-bold uppercase tracking-tight mb-1">{product.title}</h3>
                <p className="text-[#888888]">
                  {formatPrice(
                    product.priceRange.minVariantPrice.amount,
                    product.priceRange.minVariantPrice.currencyCode
                  )}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
