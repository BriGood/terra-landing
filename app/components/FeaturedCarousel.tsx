'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';
import { formatPrice, type ProductListItem } from '@/lib/shopify';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

export default function FeaturedCarousel({ products }: { products: ProductListItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Cards have exact 1/2 (mobile) or 1/4 (desktop) basis with no flex gap,
    // so one viewport width equals one page of products.
    const maxScroll = el.scrollWidth - el.clientWidth;
    setPageCount(Math.max(1, Math.ceil((el.scrollWidth - 1) / el.clientWidth)));
    setPage(Math.round(el.scrollLeft / el.clientWidth));
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= maxScroll - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  // Relative scroll — robust against snap/rounding drift in the page index.
  function scrollByPage(dir: -1 | 1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  }

  function goToPage(p: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * p, behavior: 'smooth' });
  }

  return (
    <div className="relative">
      {/* Arrows — desktop only; mobile uses swipe + dots */}
      <button
        type="button"
        aria-label="Previous products"
        onClick={() => scrollByPage(-1)}
        disabled={atStart}
        className="hidden lg:flex absolute left-0 top-[38%] -translate-y-1/2 -translate-x-1/2 z-10 h-12 w-12 items-center justify-center bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronLeftIcon size={20} />
      </button>
      <button
        type="button"
        aria-label="Next products"
        onClick={() => scrollByPage(1)}
        disabled={atEnd}
        className="hidden lg:flex absolute right-0 top-[38%] -translate-y-1/2 translate-x-1/2 z-10 h-12 w-12 items-center justify-center bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronRightIcon size={20} />
      </button>

      {/* Track */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.handle}`}
            className="group flex flex-col shrink-0 snap-start basis-1/2 lg:basis-1/4 px-2 lg:px-4"
          >
            <div className="relative aspect-[4/3] bg-[#111] overflow-hidden mb-3">
              {product.featuredImage && (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <p className="text-xs uppercase tracking-widest text-[#888888] mb-1">{product.vendor}</p>
            <h3 className="font-bold uppercase tracking-tight mb-1">{product.title}</h3>
            <div className="flex items-center gap-2">
              <p className="text-white">
                {formatPrice(
                  product.priceRange.minVariantPrice.amount,
                  product.priceRange.minVariantPrice.currencyCode
                )}
              </p>
              {product.compareAtPriceRange?.minVariantPrice &&
                parseFloat(product.compareAtPriceRange.minVariantPrice.amount) >
                  parseFloat(product.priceRange.minVariantPrice.amount) && (
                  <p className="text-[#888888] line-through text-sm">
                    {formatPrice(
                      product.compareAtPriceRange.minVariantPrice.amount,
                      product.compareAtPriceRange.minVariantPrice.currencyCode
                    )}
                  </p>
                )}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination dots */}
      {pageCount > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to page ${i + 1}`}
              onClick={() => goToPage(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === page ? 'bg-white' : 'bg-[#444] hover:bg-[#666]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
