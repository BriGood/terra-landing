export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24 lg:px-20">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">{slug}</h1>
    </main>
  );
}
