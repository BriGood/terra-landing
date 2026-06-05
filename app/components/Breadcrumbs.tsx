import Link from 'next/link';

type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="fixed top-24 left-0 right-0 z-40 bg-black flex items-center gap-2 text-xs uppercase tracking-widest text-[#555] px-6 lg:px-20 py-2 border-b border-[#222]">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-white transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-[#888888]">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
