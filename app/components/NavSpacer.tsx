'use client';

import { usePathname } from 'next/navigation';

export default function NavSpacer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div className={pathname === '/' ? '' : 'pt-24'}>{children}</div>;
}
