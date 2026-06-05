'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import type { CollectionListItem } from '@/lib/shopify';

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

export default function Nav({ collections = [] }: { collections?: CollectionListItem[] }) {
  const sortedCollections = [...collections].sort((a, b) => a.title.localeCompare(b.title));
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const { itemCount } = useCart();

  if (pathname === '/') return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-[#222]">
      {/* Announcement bar */}
      <div className="h-8 flex items-center justify-center border-b border-[#222]">
        <p className="text-xs uppercase tracking-widest text-[#888888]">Free shipping on orders over $50</p>
      </div>

      <div className="px-3 lg:px-20 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/Branding/Terra_Round%20Logo%20Only.svg"
            alt="Terra Fieldworks"
            width={40}
            height={40}
            className="block"
          />
          <Image
            src="/Branding/Terra_Stacked%20Text%20Only.svg"
            alt=""
            width={120}
            height={60}
            className="block md:hidden"
          />
          <Image
            src="/Branding/Terra_Text%20Only.svg"
            alt=""
            width={360}
            height={16}
            className="hidden md:block"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/home"
            className={`text-xs uppercase tracking-widest transition-colors ${
              pathname === '/home' ? 'text-white' : 'text-[#888888] hover:text-white'
            }`}
          >
            HØme
          </Link>

          {/* ShØp with dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <Link
              href="/shop"
              className={`text-xs uppercase tracking-widest transition-colors ${
                pathname.startsWith('/shop') || pathname.startsWith('/collections')
                  ? 'text-white'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              ShØp
            </Link>

            {shopOpen && collections.length > 0 && (
              <div className="absolute top-full left-0 pt-4 w-48">
                <div className="bg-black border border-[#222] py-2">
                  <Link
                    href="/shop"
                    className="block px-4 py-2 text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors"
                  >
                    All Products
                  </Link>
                  <div className="border-t border-[#222] my-1" />
                  {sortedCollections.map((c) => (
                    <Link
                      key={c.id}
                      href={`/collections/${c.handle}`}
                      className={`block px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                        pathname === `/collections/${c.handle}` ? 'text-white' : 'text-[#888888] hover:text-white'
                      }`}
                    >
                      {c.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/about"
            className={`text-xs uppercase tracking-widest transition-colors ${
              pathname === '/about' ? 'text-white' : 'text-[#888888] hover:text-white'
            }`}
          >
            AbØut
          </Link>

          <Link
            href="/contact"
            className={`text-xs uppercase tracking-widest transition-colors ${
              pathname === '/contact' ? 'text-white' : 'text-[#888888] hover:text-white'
            }`}
          >
            CØntact
          </Link>

          <Link
            href="/cart"
            className={`relative transition-colors ${
              pathname === '/cart' ? 'text-white' : 'text-[#888888] hover:text-white'
            }`}
            aria-label="Cart"
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/cart" className="relative text-white" aria-label="Cart">
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="text-white text-[28px] leading-none w-8 flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-[#222] px-6 py-6 flex flex-col gap-4">
          <Link
            href="/home"
            className="text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            HØme
          </Link>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            ShØp
          </Link>
          {sortedCollections.map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.handle}`}
              className="text-xs uppercase tracking-widest text-[#555] hover:text-white transition-colors pl-3"
              onClick={() => setMobileOpen(false)}
            >
              {c.title}
            </Link>
          ))}
          <Link
            href="/about"
            className="text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            AbØut
          </Link>
          <Link
            href="/contact"
            className="text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            CØntact
          </Link>
        </div>
      )}
    </nav>
  );
}
