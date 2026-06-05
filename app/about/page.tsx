import Breadcrumbs from '@/app/components/Breadcrumbs';

export default function AboutPage() {
  return (
    <main className="bg-black text-white px-6 pt-14 pb-24 lg:px-20">
      <Breadcrumbs crumbs={[{ label: 'HØme', href: '/home' }, { label: 'AbØut' }]} />
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">About</h1>
    </main>
  );
}
