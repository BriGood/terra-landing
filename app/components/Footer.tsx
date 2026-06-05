'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <footer className="border-t border-[#222] mt-24 px-6 lg:px-20 py-12">
      <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:items-start">

        {/* Nav links */}
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-[#555] mb-1">Navigate</p>
          <Link href="/shop" className="text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors">ShØp</Link>
          <Link href="/about" className="text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors">AbØut</Link>
          <Link href="/contact" className="text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors">CØntact</Link>
        </div>

        {/* Legal links */}
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-[#555] mb-1">Legal</p>
          <Link href="/policies/privacy-policy" className="text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/policies/terms-of-service" className="text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/policies/refund-policy" className="text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors">Refund Policy</Link>
          <Link href="/policies/shipping-policy" className="text-xs uppercase tracking-widest text-[#888888] hover:text-white transition-colors">Shipping Policy</Link>
        </div>

        {/* Socials + copyright */}
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-widest text-[#555]">Follow</p>
          <a
            href="https://www.instagram.com/terrafieldworks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#888888] hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
          <p className="text-xs text-[#555] mt-4">© 2026 Terra Fieldworks</p>
        </div>

      </div>
    </footer>
  );
}
