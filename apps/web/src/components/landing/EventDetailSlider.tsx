'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

const BG_FALLBACK = 'linear-gradient(135deg, #0d0c0c 0%, #111133 100%)';

interface Props {
  images: string[];
}

export function EventDetailSlider({ images }: Props) {
  const slideRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const currentRef = useRef(0);
  const animating  = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const goto = useCallback((next: number) => {
    if (animating.current || images.length <= 1) return;
    animating.current = true;

    const prev   = currentRef.current;
    currentRef.current = next;
    setActiveIndex(next);

    const prevEl = slideRefs.current[prev];
    const nextEl = slideRefs.current[next];
    if (!prevEl || !nextEl) { animating.current = false; return; }

    // Next slide starts behind current: slightly scaled up + transparent
    gsap.set(nextEl, { zIndex: 1, opacity: 0, scale: 1.06 });
    gsap.set(prevEl, { zIndex: 2 });

    gsap.timeline({
      onComplete: () => {
        gsap.set(prevEl, { zIndex: 0 });
        animating.current = false;
      },
    })
      .to(nextEl, { opacity: 1, scale: 1,   duration: 1.2, ease: 'power2.inOut' }, 0)
      .to(prevEl, { opacity: 0, scale: 1.04, duration: 0.9, ease: 'power2.inOut' }, 0.25);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      goto((currentRef.current + 1) % images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [goto, images.length]);

  if (images.length === 0) {
    return <div style={{ width: '100%', height: '100%', background: BG_FALLBACK }} />;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0d0c0c' }}>
      {images.map((src, i) => (
        <div
          key={src}
          ref={(el) => { slideRefs.current[i] = el; }}
          style={{
            position: 'absolute', inset: 0,
            opacity: i === 0 ? 1 : 0,
            zIndex:  i === 0 ? 2 : 0,
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            style={{ objectFit: 'cover' }}
            priority={i === 0}
          />
        </div>
      ))}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div
          style={{
            position: 'absolute', bottom: '32px', left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: '10px', zIndex: 10,
          }}
        >
          {images.map((_, i) => (
            <div
              key={i}
              style={{
                height: '5px',
                borderRadius: '3px',
                background: i === activeIndex ? '#f5f5f0' : 'rgba(245,245,240,0.3)',
                width: i === activeIndex ? '28px' : '5px',
                transition: 'width 0.4s ease, background 0.4s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
