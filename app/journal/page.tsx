import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'Field notes, gear guides, and stories from Terra Fieldworks — on tools, everyday carry, and getting the job done.',
  alternates: { canonical: '/journal' },
};

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24 lg:px-20">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">Journal</h1>
    </main>
  );
}
