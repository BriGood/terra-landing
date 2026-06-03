import Image from 'next/image';
import EmailForm from './components/EmailForm';
import HeroSlideshow from './components/HeroSlideshow';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* Left column: text + CTA — second on mobile, first on desktop */}
        <div className="flex flex-col items-start justify-start lg:justify-center px-6 pt-6 pb-6 lg:py-24 lg:px-20 order-last lg:order-first">
          {/*
            Inline SVG with viewBox starting at x=0.776 (where the "T" glyph begins
            in the source file) so the left edge of "T" sits at exactly x=0 of this
            element — no Image wrapper, no SVG-internal whitespace offset.
          */}
          <Image
            src="/Branding/Terra_Text%20Only.svg"
            alt="Terra Fieldworks"
            width={406}
            height={18}
            className="mb-8 block ml-[3px]"
          />
          <h1 className="text-4xl lg:text-7xl font-extrabold uppercase tracking-tight leading-none mb-6 whitespace-nowrap">
            <span className="block mb-2">User Driven.</span>
            <span className="block">Purpose Built.</span>
          </h1>
          <p className="text-[#888888] text-lg mb-8 max-w-sm">
            Innovative tools, gear, and everyday carry — engineered for the field.
          </p>
          <p className="text-white text-sm uppercase tracking-widest mb-3">Coming Summer &apos;26. Stay in the know.</p>
          <EmailForm />
        </div>

        {/* Right column: product image — first on mobile, second on desktop */}
        <div className="relative min-h-[29vh] lg:min-h-0 overflow-hidden order-first lg:order-last bg-black">
          <HeroSlideshow />
          <div className="absolute top-6 right-6 z-10">
            <Image
              src="/Branding/Terra_Round%20Logo%20Only.svg"
              alt="Terra Fieldworks"
              width={128}
              height={128}
            />
          </div>
        </div>

      </section>
    </main>
  );
}
