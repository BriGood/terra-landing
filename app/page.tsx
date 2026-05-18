import Image from 'next/image';
import EmailForm from './components/EmailForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* Left column: text + CTA */}
        <div className="flex flex-col items-start justify-center px-12 py-24 lg:px-20">
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
            className="mb-8 block -ml-px"
          />
          <h1 className="text-5xl lg:text-7xl font-extrabold uppercase tracking-tight leading-none mb-8">
            User Driven.<br />Purpose Built.
          </h1>
          <p className="text-[#888888] text-lg mb-12 max-w-sm">
            Innovative tools, gear, and everyday carry — engineered for the field.
          </p>
          <EmailForm />
        </div>

        {/* Right column: product image placeholder */}
        <div className="bg-[#111111] flex items-center justify-center min-h-[50vh] lg:min-h-0">
          <p className="text-[#333333] text-sm uppercase tracking-widest">Product image</p>
        </div>

      </section>
    </main>
  );
}
