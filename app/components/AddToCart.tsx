'use client';

import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';
import ExpressCheckout from './ExpressCheckout';

type Props = {
  merchandiseId: string;
  availableForSale: boolean;
  checkoutUrl: string;
  storeDomain: string;
};

// Declared at module scope rather than inside the component: an inline
// definition is a new component type on every render, which remounts the
// control and its DOM each time `loading`/`added` flips.
function QuantitySelector({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center border border-white flex-none">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="w-10 h-full flex items-center justify-center text-white hover:bg-[#222] transition-colors cursor-pointer text-lg px-2"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-8 flex items-center justify-center text-white text-sm">
        {quantity}
      </span>
      <button
        onClick={() => onChange(quantity + 1)}
        className="w-10 h-full flex items-center justify-center text-white hover:bg-[#222] transition-colors cursor-pointer text-lg px-2"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

// Solid white on the black page — the primary action, so it carries the most
// contrast of anything in the buying block.
const ADD_TO_CART_CLASSES =
  'flex-1 bg-white border border-white text-black text-sm font-bold uppercase tracking-widest hover:bg-[#d9d9d9] hover:border-[#d9d9d9] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer';

export default function AddToCart({ merchandiseId, availableForSale, checkoutUrl, storeDomain }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { addToCart, loading } = useCart();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // threshold 0 flips the moment the block's last pixel — the bottom of
        // the Shop Pay button — leaves the viewport, rather than waiting for
        // half the block to clear. The boundingClientRect check restricts that
        // to scrolling off the TOP: without it the bar would also show while
        // the block is still below the fold, i.e. on first load.
        setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
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

  return (
    <>
      {/* In-page controls */}
      <div ref={sectionRef} className="flex flex-col gap-3 w-full">
        <div className="flex w-full h-12 gap-3">
          <QuantitySelector quantity={quantity} onChange={setQuantity} />
          <button
            onClick={handleAddToCart}
            disabled={!availableForSale || loading}
            className={ADD_TO_CART_CLASSES}
          >
            {buttonLabel}
          </button>
        </div>

        <ExpressCheckout
          variantId={merchandiseId.split('/').pop() ?? ''}
          storeDomain={storeDomain}
          checkoutUrl={checkoutUrl}
        />
      </div>

      {/* Sticky bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-[#222] px-4 py-3 transition-opacity duration-100 ${
          showSticky ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* items-stretch, not items-center — the quantity control has no height
            of its own, so centring left it shorter than the button beside it. */}
        <div className="max-w-screen-xl mx-auto flex items-stretch gap-3 h-12">
          <QuantitySelector quantity={quantity} onChange={setQuantity} />
          <button
            onClick={handleAddToCart}
            disabled={!availableForSale || loading}
            className={`${ADD_TO_CART_CLASSES} h-full`}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </>
  );
}
