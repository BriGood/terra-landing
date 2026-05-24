'use client';

import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';

type Props = {
  merchandiseId: string;
  availableForSale: boolean;
  checkoutUrl: string;
};

export default function AddToCart({ merchandiseId, availableForSale, checkoutUrl }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { addToCart, loading } = useCart();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  async function handleAddToCart() {
    await addToCart(merchandiseId, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const buttonLabel = !availableForSale ? 'Sold Out' : added ? 'Added!' : loading ? 'Adding...' : 'Add to Cart';

  const QuantitySelector = () => (
    <div className="flex items-center border border-[#333] flex-none">
      <button
        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        className="w-10 h-full flex items-center justify-center text-white hover:bg-[#222] transition-colors cursor-pointer text-lg px-2"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-8 flex items-center justify-center text-white text-sm">
        {quantity}
      </span>
      <button
        onClick={() => setQuantity((q) => q + 1)}
        className="w-10 h-full flex items-center justify-center text-white hover:bg-[#222] transition-colors cursor-pointer text-lg px-2"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );

  return (
    <>
      {/* In-page controls */}
      <div ref={sectionRef} className="flex flex-col gap-3 w-full">
        <div className="flex w-full h-12 gap-3">
          <QuantitySelector />
          <button
            onClick={handleAddToCart}
            disabled={!availableForSale || loading}
            className="flex-1 bg-transparent border border-white text-white text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            {buttonLabel}
          </button>
        </div>

        <a
          href={checkoutUrl}
          className="w-full bg-white text-black text-sm font-bold uppercase tracking-widest py-4 text-center hover:bg-[#ccc] transition-colors"
        >
          Buy Now
        </a>
      </div>

      {/* Sticky bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-[#222] px-4 py-3 transition-opacity duration-100 ${
          showSticky ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-screen-xl mx-auto flex items-center gap-3 h-12">
          <QuantitySelector />
          <button
            onClick={handleAddToCart}
            disabled={!availableForSale || loading}
            className="flex-1 h-full bg-transparent border border-white text-white text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </>
  );
}
