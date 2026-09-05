'use client';

import { useEffect, useRef } from 'react';

// Uppercase Inter ExtraBold at tracking-tight measures roughly 0.62–0.73 units of
// width per character depending on the letters involved — "MERCH" is far wider per
// character than "FIREARM ACCESSORIES". That spread is why the fitted size is
// measured rather than derived from character count.
//
// This ratio is only for the pre-hydration estimate below. It sits above the
// observed range so the estimate always errs small: the heading may paint slightly
// tight for one frame, but it never paints wider than its container and snaps back.
const SAFE_RATIO = 0.78;

export default function FitHeading({
  text,
  className = '',
  maxPx = 36,
  minPx = 16,
}: {
  text: string;
  className?: string;
  /** Ceiling — the heading never grows past this, however much room there is. */
  maxPx?: number;
  /** Floor — below this the heading stops shrinking and is allowed to overflow. */
  minPx?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    let lastWidth = -1;

    const fit = (force = false) => {
      const available = parent.clientWidth;
      if (!available) return;
      // Changing the font size changes the heading's height, which re-triggers the
      // observer. Only react to actual width changes so that settles immediately.
      if (!force && available === lastWidth) return;
      lastWidth = available;

      // Letter-spacing is em-based, so text width is linear in font size and one
      // measurement at the ceiling gives the exact fitting size — no search loop.
      el.style.fontSize = `${maxPx}px`;
      const full = el.scrollWidth;
      const fitted = full > available ? Math.floor(maxPx * (available / full)) : maxPx;
      el.style.fontSize = `${Math.max(minPx, Math.min(maxPx, fitted))}px`;
    };

    fit(true);

    // The webfont swaps in after first paint and changes the metrics, so re-fit
    // once it has actually loaded — otherwise the size reflects the fallback face.
    document.fonts?.ready.then(() => fit(true)).catch(() => {});

    const observer = new ResizeObserver(() => fit());
    observer.observe(parent);
    return () => observer.disconnect();
  }, [text, maxPx, minPx]);

  return (
    <h1
      ref={ref}
      className={className}
      style={{
        // Server-rendered estimate, replaced with the measured size on hydration.
        // Needs an inline-size container on the parent for cqw to resolve.
        fontSize: `min(${maxPx}px, calc(100cqw / ${(text.length * SAFE_RATIO).toFixed(2)}))`,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </h1>
  );
}
