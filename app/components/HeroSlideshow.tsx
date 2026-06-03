'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const images = [
  { src: '/Branding/LandingImage1.jpg', className: 'object-cover object-center' },
  { src: '/Branding/LandingImage2.jpg', className: 'object-cover object-right-bottom' },
  { src: '/Branding/LandingImage3.jpg', className: 'object-cover object-right-bottom' },
  { src: '/Branding/LandingImage4.jpg', className: 'object-cover object-right-bottom' },
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
      {images.map((image, i) => (
        <div
          key={image.src}
          className={`absolute inset-0 transition-opacity duration-[4000ms] ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            ref={el => { zoomRefs.current[i] = el; }}
            className="absolute inset-0"
          >
            <Image
              src={image.src}
              alt="Terra Fieldworks product"
              fill
              priority={i === 0}
              className={image.className}
            />
          </div>
        </div>
      ))}
    </>
  );
}
