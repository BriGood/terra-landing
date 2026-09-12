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
    const target = sectionRef.current;
    if (!target) return;

    // Two bars are pinned to the top of the viewport — the nav, and the
    // breadcrumb strip below it — so the buying block leaves *view* once it
    // slides under them, ~130px before it reaches y=0. Measured rather than
    // hardcoded so it keeps up if either bar changes height.
    function topInset() {
      let bottom = 0;
      document.querySelectorAll('nav').forEach((el) => {
        if (getComputedStyle(el).position !== 'fixed') return;
        const rect = el.getBoundingClientRect();
        // Pinned near the top of the viewport. The breadcrumb strip starts at
        // y=96, below the nav's own height, so the test is "starts high on the
        // screen" rather than anything relative to the element's own box.
        if (rect.top >= 0 && rect.top < window.innerHeight / 3) {
          bottom = Math.max(bottom, rect.bottom);
        }
      });
      return bottom;
    }

    let frame = 0;

    // A direct geometric test rather than an IntersectionObserver. The observer
    // only fires when an intersection threshold is *crossed*, so jumping from
    // deep in the page straight back to the top — scroll restoration, a jump
    // link — never re-fires when the block is below the fold both before and
    // after, leaving the bar stuck on screen.
    function update() {
      frame = 0;
      setShowSticky(target!.getBoundingClientRect().bottom <= topInset());
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
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
