'use client';

import { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SECTIONS, type AboutContent } from '@/lib/content';
import { isOptimizableImage } from '@/lib/imageSrc';

gsap.registerPlugin(ScrollTrigger);

const BG      = '#0d0c0c';
const FG      = '#f5f5f0';
const ACCENT  = '#84f649';
const PRIMARY = '#2235fd';
const MUTED   = 'rgba(245,245,240,0.38)';
const EASE    = [0.76, 0, 0.24, 1] as const;

const FONT_DISPLAY = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_BODY    = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';

// Los paneles alternan el color de acento (verde / azul) — fijo por posición,
// el admin solo edita textos e imagen.
const PILLAR_ACCENTS = [ACCENT, PRIMARY, ACCENT, PRIMARY];

// La cinta necesita suficientes palabras para cubrir el ancho de pantalla:
// repetimos las frases del admin hasta llegar al mismo largo que tenía la lista original.
const MIN_TICKER_ITEMS = 13;

interface Props {
  /** Textos, paneles y cinta editables desde el dashboard ("Contenido del sitio → Nosotros"). */
  content: AboutContent;
}

export function AboutLanding({ content }: Props) {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const marqueeRef   = useRef<HTMLDivElement>(null);

  const pillars = content.pillars.map((p, i) => ({
    ...p,
    num: String(i + 1).padStart(2, '0'),
    accent: PILLAR_ACCENTS[i % PILLAR_ACCENTS.length],
  }));

  const tickerWords = useMemo(() => {
    const words = content.tickerWords.map((w) => w.text.trim()).filter(Boolean);
    const source = words.length > 0 ? words : SECTIONS.about.defaults.tickerWords.map((w) => w.text);
    const total = Math.max(MIN_TICKER_ITEMS, source.length * 3);
    return Array.from({ length: total }, (_, i) => source[i % source.length]);
  }, [content.tickerWords]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track   = trackRef.current;
    if (!wrapper || !track) return;

    const ctx = gsap.context(() => {
      const getDistance = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 1.4,
          end: () => `+=${getDistance()}`,
          invalidateOnRefresh: true,
        },
      });
    }, wrapper);

    return () => ctx.revert();
  }, [pillars.length]);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const tween = gsap.to(marquee, {
      xPercent: -50,
      duration: 28,
      ease: 'none',
      repeat: -1,
    });

    return () => { tween.kill(); };
  }, [tickerWords]);

  // Refresh ScrollTrigger when a nav-link scroll is about to fire so the
  // pin spacer height is accurate before getBoundingClientRect is called.
  useEffect(() => {
    const handler = () => ScrollTrigger.refresh();
    window.addEventListener('jm:nav-start', handler);
    return () => window.removeEventListener('jm:nav-start', handler);
  }, []);

  return (
    <Box
      ref={sectionRef}
      id="nosotros"
      component="section"
      sx={{ position: 'relative', backgroundColor: BG, overflow: 'hidden', scrollMarginTop: { xs: '64px', md: '72px' } }}
    >

      {/* ── INTRO BLOCK ── */}
      <Box
        sx={{
          px: { xs: '20px', md: '60px', xl: '80px' },
          pt: { xs: '80px', md: '120px' },
          pb: { xs: '60px', md: '80px' },
        }}
      >
        {/* Headline — dos líneas explícitas */}
        {[
          { text: content.titleLine1, color: FG,     delay: 0.05 },
          { text: content.titleLine2, color: ACCENT, delay: 0.18 },
        ].map(({ text, color, delay }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.75, delay, ease: EASE }}
          >
            <Box
              sx={{
                fontFamily: FONT_DISPLAY,
                fontSize: { xs: '9vw', sm: '6.5vw', md: '4.5vw', lg: '4vw' },
                fontWeight: 400,
                letterSpacing: '-0.025em',
                lineHeight: 1.08,
                color,
              }}
            >
              {text}
            </Box>
          </motion.div>
        ))}

        {/* Descripción */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: 'easeOut' }}
        >
          <Box
            sx={{
              mt: '28px',
              fontFamily: FONT_BODY,
              fontSize: { xs: '15px', md: '17px' },
              color: { xs: FG, md: MUTED },
              lineHeight: 1.68,
              maxWidth: '540px',
            }}
          >
            {content.description}
          </Box>
        </motion.div>
      </Box>

      {/* ── HORIZONTAL SCROLL — pinned wrapper ── */}
      <Box ref={wrapperRef} sx={{ overflow: 'hidden' }}>
        {/* Track: N panels de 100vw */}
        <Box
          ref={trackRef}
          sx={{
            display: 'flex',
            width: `${pillars.length * 100}vw`,
            height: '100vh',
            willChange: 'transform',
          }}
        >
          {pillars.map((p, idx) => (
            <Box
              key={p.num}
              sx={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'stretch',
                borderLeft: idx > 0 ? `1px solid rgba(245,245,240,0.06)` : 'none',
              }}
            >
              {/* Giant background number */}
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  bottom: '-0.12em',
                  right: { xs: '-0.05em', md: '0' },
                  fontFamily: FONT_DISPLAY,
                  fontSize: { xs: '45vw', md: '28vw' },
                  fontWeight: 400,
                  lineHeight: 1,
                  color: 'rgba(245,245,240,0.025)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  zIndex: 0,
                }}
              >
                {p.num}
              </Box>

              {/* Content */}
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  alignItems: 'stretch',
                }}
              >
                {/* LEFT — text */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    px: { xs: '28px', md: '80px', xl: '100px' },
                    py: { xs: '60px', md: '0' },
                    borderRight: { md: `1px solid rgba(245,245,240,0.06)` },
                  }}
                >
                  {/* Index + label */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      mb: '44px',
                    }}
                  >
                    <Box
                      sx={{
                        fontFamily: FONT_BODY,
                        fontSize: { xs: '12px', md: '13px' },
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'rgba(245,245,240,0.2)',
                      }}
                    >
                      {p.num}
                    </Box>
                    <Box sx={{ width: '32px', height: '1px', backgroundColor: p.accent }} />
                    <Box
                      sx={{
                        fontFamily: FONT_BODY,
                        fontSize: { xs: '12px', md: '13px' },
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: p.accent,
                      }}
                    >
                      {p.label}
                    </Box>
                  </Box>

                  {/* Title */}
                  <Box
                    sx={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: { xs: '22vw', sm: '16vw', md: '10.5vw', lg: '9.5vw' },
                      fontWeight: 400,
                      letterSpacing: '-0.04em',
                      lineHeight: 0.9,
                      color: FG,
                      mb: '36px',
                    }}
                  >
                    {p.title}
                  </Box>

                  {/* Body */}
                  <Box
                    sx={{
                      fontFamily: FONT_BODY,
                      fontSize: { xs: '16px', md: '18px', lg: '20px' },
                      color: { xs: FG, md: MUTED },
                      lineHeight: 1.72,
                      maxWidth: '460px',
                    }}
                  >
                    {p.body}
                  </Box>

                  {/* Progress pills */}
                  <Box sx={{ display: 'flex', gap: '8px', mt: '52px' }}>
                    {pillars.map((_, i) => (
                      <Box
                        key={i}
                        sx={{
                          height: '2px',
                          width: i === idx ? '32px' : '12px',
                          backgroundColor: i === idx ? p.accent : 'rgba(245,245,240,0.12)',
                          borderRadius: '2px',
                          transition: 'width 0.3s',
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* RIGHT — image: columna en desktop, fondo absoluto en mobile */}
                <Box
                  sx={{
                    position: { xs: 'absolute', md: 'relative' },
                    inset: { xs: 0, md: 'auto' },
                    zIndex: { xs: 0, md: 'auto' },
                    opacity: { xs: 0.22, md: 1 },
                    overflow: 'hidden',
                    backgroundColor: BG,
                  }}
                >
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      unoptimized={!isOptimizableImage(p.image)}
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      sizes="50vw"
                    />
                  )}
                  {/* Overlay oscuro — menos intenso que el hero */}
                  <Box
                    aria-hidden
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(13,12,12,0.22)',
                      zIndex: 1,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── MARQUEE TICKER ── */}
      <Box
        sx={{
          backgroundColor: PRIMARY,
          overflow: 'hidden',
          py: { xs: '28px', md: '36px' },
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Track: dos copias idénticas para el loop seamless */}
        <Box
          ref={marqueeRef}
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: 'max-content',
            willChange: 'transform',
          }}
        >
          {[0, 1].map((copy) => (
            <Box
              key={copy}
              sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
            >
              {tickerWords.map((word, i) => (
                <Box
                  key={`${copy}-${i}`}
                  sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
                >
                  <Box
                    sx={{
                      fontFamily: FONT_BODY,
                      fontSize: { xs: '5.5vw', sm: '3.5vw', md: '2.2vw' },
                      fontWeight: 500,
                      letterSpacing: '0.04em',
                      color: FG,
                      whiteSpace: 'nowrap',
                      px: { xs: '4vw', md: '2.5vw' },
                    }}
                  >
                    {word}
                  </Box>
                  {/* Separador */}
                  <Box
                    aria-hidden
                    sx={{
                      width: { xs: '7px', md: '9px' },
                      height: { xs: '7px', md: '9px' },
                      borderRadius: '50%',
                      backgroundColor: ACCENT,
                      flexShrink: 0,
                    }}
                  />
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
