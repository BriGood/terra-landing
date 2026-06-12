import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Answers to common questions about Terra Fieldworks products, orders, shipping, returns, and warranty.',
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24 lg:px-20">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">FAQ</h1>
    </main>
  );
}
