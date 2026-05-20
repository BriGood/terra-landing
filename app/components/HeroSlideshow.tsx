'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const images = [
  '/Landing%20Page%20Images/LandingImage1.png',
  '/Landing%20Page%20Images/LandingImage2.png',
  '/Landing%20Page%20Images/LandingImage3.png',
  '/Landing%20Page%20Images/LandingImage4.png',
];

const SLIDE_DURATION = 8000;
const KB_PRESTART    = 2000; // start Ken Burns on next image this many ms before the fade

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const zoomRefs = useRef<(HTMLDivElement | null)[]>([]);

  const startKB = (index: number) => {
    const el = zoomRefs.current[index];
    if (!el) return;
    el.style.animation = 'none';
    void el.offsetHeight; // force reflow to restart from beginning
    el.style.animation = 'kenburns 12s ease-in-out forwards';
  };

  useEffect(() => {
    let slide = 0;
    let kbTimeout: ReturnType<typeof setTimeout>;
    let slideTimeout: ReturnType<typeof setTimeout>;

    const schedule = () => {
      // Pre-start Ken Burns on the next image before the fade begins
      kbTimeout = setTimeout(() => {
        startKB((slide + 1) % images.length);
      }, SLIDE_DURATION - KB_PRESTART);

      // Trigger the fade after the full slide duration
      slideTimeout = setTimeout(() => {
        slide = (slide + 1) % images.length;
        setCurrent(slide);
        schedule();
      }, SLIDE_DURATION);
    };

    startKB(0); // kick off Ken Burns on the first image immediately
    schedule();

    return () => {
      clearTimeout(kbTimeout);
      clearTimeout(slideTimeout);
    };
  }, []);

  return (
    <>
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-[4000ms] ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            ref={el => { zoomRefs.current[i] = el; }}
            className="absolute inset-0"
          >
            <Image
              src={src}
              alt="Terra Fieldworks product"
              fill
              priority={i === 0}
              className="object-cover object-right-bottom"
            />
          </div>
        </div>
      ))}
    </>
  );
}
