import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { getPolicy } from '@/lib/shopify';

// Deduped so generateMetadata and the page share a single Shopify request per render.
const loadPolicy = cache(getPolicy);

export async function generateStaticParams() {
  return [
    { handle: 'privacy-policy' },
    { handle: 'terms-of-service' },
    { handle: 'refund-policy' },
    { handle: 'shipping-policy' },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const policy = await loadPolicy(handle);

  if (!policy) return { title: 'Not Found' };

  return {
    title: policy.title,
    description: `${policy.title} for Terra Fieldworks.`,
    alternates: { canonical: `/policies/${handle}` },
  };
}

export default async function PolicyPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const policy = await loadPolicy(handle);
  if (!policy) notFound();

  return (
    <main className="bg-black text-white px-6 pt-14 pb-24 lg:px-20">
      <Breadcrumbs crumbs={[{ label: 'HØme', href: '/home' }, { label: policy.title }]} />

      <div className="max-w-3xl">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight mb-10">
          {policy.title}
        </h1>
        <div
          className="policy-body text-[#888888] leading-relaxed text-sm"
          dangerouslySetInnerHTML={{ __html: policy.body }}
        />
      </div>
    </main>
  );
}
