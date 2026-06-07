import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/shopify';
import ProductImageCarousel from '@/app/components/ProductImageCarousel';
import VariantSelector from '@/app/components/VariantSelector';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  return (
    <main className="min-h-screen bg-black text-white px-6 pt-14 pb-14 lg:px-20">
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

          {product.descriptionHtml && (
            <div
              className="text-[#888888] mb-8 leading-snug [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}

          <VariantSelector
            variants={product.variants}
            storeDomain={process.env.SHOPIFY_STORE_DOMAIN ?? ''}
            productTitle={product.title}
          />

          {(product.specs.dimensions || product.specs.material || product.specs.weight || product.specs.origin) && (
            <div className="mt-12">
              <div className="flex flex-col gap-3">
                {product.specs.dimensions && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#555] uppercase tracking-widest text-xs">Dimensions</span>
                    <span className="text-[#888888]">{product.specs.dimensions}</span>
                  </div>
                )}
                {product.specs.material && (
                  <div className="flex justify-between text-sm border-t border-[#111] pt-3">
                    <span className="text-[#555] uppercase tracking-widest text-xs">Material</span>
                    <span className="text-[#888888]">{product.specs.material}</span>
                  </div>
                )}
                {product.specs.weight && (
                  <div className="flex justify-between text-sm border-t border-[#111] pt-3">
                    <span className="text-[#555] uppercase tracking-widest text-xs">Weight</span>
                    <span className="text-[#888888]">{product.specs.weight}</span>
                  </div>
                )}
                {product.specs.origin && (
                  <div className="flex justify-between text-sm border-t border-[#111] pt-3">
                    <span className="text-[#555] uppercase tracking-widest text-xs">Origin</span>
                    <span className="text-[#888888]">{product.specs.origin}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
