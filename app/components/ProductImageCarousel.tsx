'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

type Props = {
  images: { url: string; altText: string | null }[];
  title: string;
};

export default function ProductImageCarousel({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!zoomed) return;
    // Jump the lightbox carousel to the current image on open (no smooth scroll).
    const container = lightboxRef.current;
    if (container) container.scrollLeft = container.clientWidth * activeIndex;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLightbox(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomed]);

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

  function scrollLightboxTo(index: number) {
    const container = lightboxRef.current;
    if (!container) return;
    container.scrollTo({ left: container.clientWidth * index, behavior: 'smooth' });
    setActiveIndex(index);
  }

  function onLightboxScroll() {
    const container = lightboxRef.current;
    if (!container) return;
    setActiveIndex(Math.round(container.scrollLeft / container.clientWidth));
  }

  function closeLightbox() {
    const lb = lightboxRef.current;
    const idx = lb ? Math.round(lb.scrollLeft / lb.clientWidth) : activeIndex;
    setActiveIndex(idx);
    // Keep the mobile scroll carousel in sync with wherever the lightbox left off.
    const main = scrollRef.current;
    if (main) main.scrollLeft = main.clientWidth * idx;
    setZoomed(false);
  }

  if (images.length === 0) {
    return <div className="aspect-[4/3] bg-[#111]" />;
  }

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  return (
    <>
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
                  onClick={() => setZoomed(true)}
                  className="relative aspect-[4/3] flex-none w-full snap-start bg-[#111] overflow-hidden cursor-zoom-in"
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
          <div
            onClick={() => setZoomed(true)}
            className="relative aspect-[4/3] bg-[#111] overflow-hidden cursor-zoom-in"
          >
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
                <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-10 h-10 flex items-center justify-center text-xl transition-colors cursor-pointer" aria-label="Previous">‹</button>
                <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-10 h-10 flex items-center justify-center text-xl transition-colors cursor-pointer" aria-label="Next">›</button>
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

      {/* Lightbox */}
      {zoomed && (
        <div className="fixed inset-0 z-50 bg-black/95">
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-10 text-white text-2xl w-10 h-10 flex items-center justify-center hover:text-[#888] transition-colors cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
          <div
            ref={lightboxRef}
            onScroll={onLightboxScroll}
            className="flex h-full w-full overflow-x-scroll snap-x snap-mandatory overscroll-contain"
            style={{ scrollbarWidth: 'none' }}
          >
            {images.map((image, i) => (
              <div
                key={i}
                onClick={closeLightbox}
                className="relative flex-none w-full h-full snap-center cursor-zoom-out"
              >
                <Image
                  src={image.url}
                  alt={image.altText ?? title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={() => scrollLightboxTo((activeIndex - 1 + images.length) % images.length)}
                className="absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white w-10 h-10 flex items-center justify-center text-2xl transition-colors cursor-pointer"
                aria-label="Previous"
              >‹</button>
              <button
                onClick={() => scrollLightboxTo((activeIndex + 1) % images.length)}
                className="absolute right-5 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white w-10 h-10 flex items-center justify-center text-2xl transition-colors cursor-pointer"
                aria-label="Next"
              >›</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
