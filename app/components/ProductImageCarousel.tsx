'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';

type Props = {
  images: { url: string; altText: string | null }[];
  title: string;
};

export default function ProductImageCarousel({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollTo(index: number) {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({ left: container.clientWidth * index, behavior: 'smooth' });
    setActiveIndex(index);
  }

  function onScroll() {
    const container = scrollRef.current;
    if (!container) return;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    setActiveIndex(index);
  }

  if (images.length === 0) {
    return <div className="aspect-[4/3] bg-[#111]" />;
  }

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  return (
    <div className="flex flex-col gap-4">

      {/* Mobile: scroll-snap carousel */}
      <div className="md:hidden">
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="flex overflow-x-scroll snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {images.map((image, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] flex-none w-full snap-start bg-[#111] overflow-hidden"
              >
                <Image
                  src={image.url}
                  alt={image.altText ?? title}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
          {images.length > 1 && (
            <>
              <button onClick={() => scrollTo((activeIndex - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-8 h-8 flex items-center justify-center transition-colors cursor-pointer" aria-label="Previous">‹</button>
              <button onClick={() => scrollTo((activeIndex + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-8 h-8 flex items-center justify-center transition-colors cursor-pointer" aria-label="Next">›</button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${
                  i === activeIndex ? 'bg-white' : 'bg-[#444]'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: large featured image + thumbnail strip */}
      <div className="hidden md:flex flex-col gap-3">
        <div className="relative aspect-[4/3] bg-[#111] overflow-hidden">
          <Image
            src={images[activeIndex].url}
            alt={images[activeIndex].altText ?? title}
            fill
            className="object-cover transition-opacity duration-200"
            priority
            sizes="50vw"
          />
          {images.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-10 h-10 flex items-center justify-center text-xl transition-colors cursor-pointer" aria-label="Previous">‹</button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-10 h-10 flex items-center justify-center text-xl transition-colors cursor-pointer" aria-label="Next">›</button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2">
            {images.map((image, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative aspect-[4/3] w-16 flex-none bg-[#111] overflow-hidden border transition-colors ${
                  i === activeIndex ? 'border-white cursor-default' : 'border-transparent hover:border-[#444] cursor-pointer'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={image.url}
                  alt={image.altText ?? title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
