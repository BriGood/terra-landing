export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24 lg:px-20">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">Order Confirmed</h1>
      <p className="text-[#888888] mt-4">Order #{id}</p>
    </main>
  );
}
