'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import Image from 'next/image';

// Logo initial/final dimensions
const LOGO_INIT_W = 360;
const LOGO_INIT_H = Math.round(360 / (152 / 42)); // keep aspect ratio → 99px
// Navbar logo dimensions (matches NavbarLanding)
const LOGO_FINAL_W = 152;
const LOGO_FINAL_H = 42;

export function PageLoader() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    if (!overlay || !logo) return;

    tlRef.current?.kill();

    const isMobile = window.innerWidth < 768;
    // Padding matches NavbarLanding — same as section PX: xs:20px md:60px xl:80px
    const paddingX = isMobile ? 20 : 60;
    const navH = isMobile ? 64 : 72;

    // Pure pixel positioning — no percentage or xPercent to avoid CSS/GSAP conflicts
    const initLeft = window.innerWidth / 2 - LOGO_INIT_W / 2;
    const initTop = window.innerHeight / 2 - LOGO_INIT_H / 2;
    const finalLeft = paddingX;
    const finalTop = (navH - LOGO_FINAL_H) / 2;

    gsap.set(overlay, { opacity: 1, display: 'block', pointerEvents: 'all' });
    gsap.set(logo, {
      opacity: 1,
      left: initLeft,
      top: initTop,
      xPercent: 0,
      yPercent: 0,
      width: LOGO_INIT_W,
      height: LOGO_INIT_H,
      scale: 1,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { pointerEvents: 'none', display: 'none' });
      },
    });
    tlRef.current = tl;

    // Pulse ~2.7s (3 cycles × 0.9s)
    tl.to(logo, {
      scale: 1.07,
      duration: 0.45,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: 2,
    });

    // Move + shrink to exact navbar logo position
    tl.to(logo, {
      left: finalLeft,
      top: finalTop,
      width: LOGO_FINAL_W,
      height: LOGO_FINAL_H,
      duration: 0.7,
      ease: 'power3.inOut',
    });

    // Fade overlay while logo lands
    tl.to(overlay, {
      opacity: 0,
      duration: 0.45,
      ease: 'power2.in',
    }, '-=0.3');

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          // Gradient between primary and accent only
          background: 'linear-gradient(-45deg, #2235fd, #4d5dff, #84f649, #a3ff6e, #2235fd)',
          backgroundSize: '400% 400%',
          animation: 'jmLoaderGradient 4s ease infinite',
          pointerEvents: 'all',
        }}
      >
        {/* Logo — positioned entirely by GSAP, no initial left/top to avoid conflicts */}
        <div
          ref={logoRef}
          style={{
            position: 'absolute',
            width: LOGO_INIT_W,
            height: LOGO_INIT_H,
            opacity: 0, // GSAP sets opacity: 1 immediately
          }}
        >
          <Image
            src="/logos/logo_JM_bg_dark_op1.svg"
            alt="Jornadas Misioneras"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </div>
      <style>{`
        @keyframes jmLoaderGradient {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}
