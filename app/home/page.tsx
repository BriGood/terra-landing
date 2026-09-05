import Image from 'next/image';
import Link from 'next/link';
import { getProducts, getCollection, FEATURED_COLLECTION_HANDLE } from '@/lib/shopify';
import FeaturedCarousel from '@/app/components/FeaturedCarousel';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Which products are featured, and in what order, is curated in Shopify (the
  // hidden "Featured" collection, manual sort) so it can be changed in admin
  // without a deploy. Falls back to the full catalog if that collection is
  // missing or empty, so the carousel is never blank.
  const featured = await getCollection(FEATURED_COLLECTION_HANDLE).catch(() => null);
  const products = featured?.products.length ? featured.products : await getProducts();

  return (
    <main className="bg-black text-white">

      {/* Hero — full-width banner with text overlay */}
      <section className="relative w-full h-[25vh] lg:h-[42vh] overflow-hidden">
        <Image
          src="/Branding/HomeBanner.jpg"
          alt="Terra Fieldworks"
          fill
          className="object-cover object-[58%_40%] lg:object-[center_48%]"
          priority
          quality={85}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center px-6 lg:px-20">
          <h1 className="text-[2.5rem] lg:text-[100px] font-extrabold uppercase tracking-tight leading-none">
            <span className="block">User Driven.</span>
            <span className="block">Purpose Built.</span>
          </h1>
        </div>
      </section>


      {/* Featured Products */}
      {products.length > 0 && (
        <section className="px-6 pt-8 pb-16 lg:px-20 lg:pt-10 border-t border-[#222]">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-center mb-8">
            Featured Products
          </h2>
          <FeaturedCarousel products={products} />
          <div className="flex justify-center mt-8">
            <Link
              href="/shop"
              className="text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors"
            >
              View All →
            </Link>
          </div>
        </section>
      )}

    </main>
  );
}
