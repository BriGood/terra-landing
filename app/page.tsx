export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* Left column: text + CTA */}
        <div className="flex flex-col justify-center px-12 py-24 lg:px-20">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#888888] mb-8">
            Terra Fieldworks
          </p>
          <h1 className="text-5xl lg:text-7xl font-extrabold uppercase tracking-tight leading-none mb-8">
            Rugged by design.<br />Ready for anything.
          </h1>
          <p className="text-[#888888] text-lg mb-12 max-w-sm">
            Innovative tools, gear, and everyday carry — engineered for the field.
          </p>
          <div>
            <a
              href="#"
              className="inline-block bg-white text-black text-sm font-semibold uppercase tracking-widest px-10 py-4 hover:bg-[#e0e0e0] transition-colors"
            >
              Shop Now
            </a>
          </div>
        </div>

        {/* Right column: product image placeholder */}
        <div className="bg-[#111111] flex items-center justify-center min-h-[50vh] lg:min-h-0">
          <p className="text-[#333333] text-sm uppercase tracking-widest">Product image</p>
        </div>

      </section>
    </main>
  );
}
