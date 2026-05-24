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
    return <div className="aspect-square bg-[#111]" />;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile carousel */}
      <div className="md:hidden">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {images.map((image, i) => (
            <div
              key={i}
              className="relative aspect-square flex-none w-full snap-start bg-[#111] overflow-hidden"
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

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === activeIndex ? 'bg-white' : 'bg-[#444]'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop stacked */}
      <div className="hidden md:flex flex-col gap-4">
        {images.map((image, i) => (
          <div key={i} className="relative aspect-square bg-[#111] overflow-hidden">
            <Image
              src={image.url}
              alt={image.altText ?? title}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="50vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
