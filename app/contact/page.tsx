import Breadcrumbs from '@/app/components/Breadcrumbs';

export default function ContactPage() {
  return (
    <main className="bg-black text-white px-6 pt-14 pb-24 lg:px-20">
      <Breadcrumbs crumbs={[{ label: 'HØme', href: '/home' }, { label: 'CØntact' }]} />
      <h1 className="text-4xl font-extrabold uppercase tracking-tight mb-2">CØntact</h1>
      <p className="text-[#888888] mb-12">We're here to help. Reach out to the right team below.</p>

      <div className="flex flex-col lg:flex-row gap-6 max-w-3xl">

        {/* General Support */}
        <div className="flex-1 border border-[#222] p-8">
          <p className="text-xs uppercase tracking-widest text-[#888888] mb-3">General Support</p>
          <h2 className="text-xl font-extrabold uppercase tracking-tight mb-3">Product & Orders</h2>
          <p className="text-[#888888] text-sm mb-3 leading-relaxed">
            Product inquiries, order questions, shipping, and troubleshooting.
          </p>
          <p className="text-xs uppercase tracking-widest text-[#555] mb-6">Response within 1–2 business days</p>
          <a
            href="mailto:support@terrafieldworks.com"
            className="text-sm uppercase tracking-widest text-white border border-white px-6 py-3 inline-block hover:bg-white hover:text-black transition-colors"
          >
            support@terrafieldworks.com
          </a>
        </div>

        {/* Warranty */}
        <div className="flex-1 border border-[#222] p-8">
          <p className="text-xs uppercase tracking-widest text-[#888888] mb-3">Warranty</p>
          <h2 className="text-xl font-extrabold uppercase tracking-tight mb-3">Warranty Claims</h2>
          <p className="text-[#888888] text-sm mb-3 leading-relaxed">
            Submit a warranty claim for any Terra Fieldworks product.
          </p>
          <p className="text-xs uppercase tracking-widest text-[#555] mb-6">Response within 1–2 business days</p>
          <a
            href="mailto:warranty@terrafieldworks.com"
            className="text-sm uppercase tracking-widest text-white border border-white px-6 py-3 inline-block hover:bg-white hover:text-black transition-colors"
          >
            warranty@terrafieldworks.com
          </a>
        </div>

      </div>
    </main>
  );
}
