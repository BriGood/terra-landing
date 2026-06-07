'use client';

import { useState } from 'react';
import AddToCart from './AddToCart';
import { formatPrice } from '@/lib/shopify';
import type { ProductVariant } from '@/lib/shopify';

const COLOR_MAP: Record<string, string> = {
  black:  '#1c1c1c',
  tan:    '#c4a882',
  od:     '#4a5240',
};

type Props = {
  variants: ProductVariant[];
  storeDomain: string;
  productTitle: string;
};

export default function VariantSelector({ variants, storeDomain, productTitle }: Props) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? '');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyState, setNotifyState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
  const colorOption = selected?.selectedOptions.find((o) => o.name === 'Color');

  const price = formatPrice(selected.price.amount, selected.price.currencyCode);
  const compareAtPrice = selected.compareAtPrice &&
    parseFloat(selected.compareAtPrice.amount) > parseFloat(selected.price.amount)
      ? formatPrice(selected.compareAtPrice.amount, selected.compareAtPrice.currencyCode)
      : null;

  const hasColors = variants.some((v) => v.selectedOptions.some((o) => o.name === 'Color'));

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    setNotifyState('loading');
    try {
      const res = await fetch('/api/notify-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: notifyEmail,
          productTitle,
          color: colorOption?.value,
        }),
      });
      if (!res.ok) throw new Error();
      setNotifyState('success');
    } catch {
      setNotifyState('error');
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Price */}
      <div className="flex items-center gap-3">
        <p className="text-2xl font-bold">{price}</p>
        {compareAtPrice && (
          <p className="text-lg text-[#888888] line-through">{compareAtPrice}</p>
        )}
      </div>

      {/* Color selector */}
      {hasColors && (
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-[#555] mb-2">
            Color — <span className="text-white">{colorOption?.value}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {variants.map((v) => {
              const color = v.selectedOptions.find((o) => o.name === 'Color')?.value ?? '';
              const hex = COLOR_MAP[color.toLowerCase()];
              const isSelected = v.id === selectedId;
              if (!hex) return null;
              return (
                <button
                  key={v.id}
                  onClick={() => { setSelectedId(v.id); setNotifyState('idle'); setNotifyEmail(''); }}
                  title={color}
                  aria-label={color}
                  className={`w-7 h-7 rounded-full transition-all cursor-pointer ring-offset-2 ring-offset-black
                    ${isSelected ? 'ring-2 ring-white' : 'ring-1 ring-[#444] hover:ring-white'}
                    ${!v.availableForSale ? 'opacity-40' : ''}
                  `}
                  style={{ backgroundColor: hex }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Add to cart or Notify Me */}
      {selected.availableForSale ? (
        <AddToCart
          merchandiseId={selected.id}
          availableForSale={selected.availableForSale}
          checkoutUrl={`https://${storeDomain}/cart/${selected.id.split('/').pop()}:1`}
          storeDomain={storeDomain}
        />
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-[#555]">Out of Stock</p>
          {notifyState === 'success' ? (
            <p className="text-xs uppercase tracking-widest text-[#888888]">We'll email you when it's back.</p>
          ) : (
            <form onSubmit={handleNotify} className="flex flex-col gap-3">
              <input
                type="email"
                required
                placeholder="Your email"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="bg-transparent border border-[#333] text-white text-sm px-4 py-3 placeholder:text-[#555] focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                disabled={notifyState === 'loading'}
                className="border border-white text-white text-sm font-bold uppercase tracking-widest py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-50 cursor-pointer"
              >
                {notifyState === 'loading' ? 'Sending...' : 'Notify Me'}
              </button>
              {notifyState === 'error' && (
                <p className="text-xs text-red-400">Something went wrong. Try again.</p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
