'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/app/context/CartContext';

const links = [
  { href: '/home', label: 'HØme' },
  { href: '/shop', label: 'ShØp' },
  { href: '/about', label: 'AbØut' },
];

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  if (pathname === '/') return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-[#222]">
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
          {/* Mobile stacked wordmark */}
          <Image
            src="/Branding/Terra_Stacked%20Text%20Only.svg"
            alt=""
            width={120}
            height={60}
            className="block md:hidden"
          />
          {/* Desktop wordmark */}
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
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs uppercase tracking-widest transition-colors ${
                pathname === link.href
                  ? 'text-white'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
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
        <div className="md:hidden bg-black border-t border-[#222] px-6 py-6 flex flex-col gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
