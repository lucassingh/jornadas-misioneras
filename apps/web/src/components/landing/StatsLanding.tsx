'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import gsap from 'gsap';
import type { StatsContent } from '@/lib/content';

const BG_SECTION = '#f5f5f0';
const FG_DARK    = '#0d0c0c';
const FG_LIGHT   = '#f5f5f0';
const ACCENT     = '#84f649';
const PRIMARY    = '#2235fd';

const FONT_DISPLAY = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_BODY    = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';

const EASE     = [0.76, 0, 0.24, 1] as const;
const HOVER_UP = { y: -8, transition: { type: 'spring' as const, stiffness: 360, damping: 26 } };
const PX       = { xs: '20px', md: '60px', xl: '80px' };

// Estilo fijo por posición de tarjeta (azul grande / verde / negra) — el admin
// solo edita número, etiqueta y descripción.
const CARD_STYLES = [
  {
    area: 'stat300',
    bg: PRIMARY,
    bgImage: `radial-gradient(rgba(255,255,255,0.1) 1.5px, transparent 1.5px), radial-gradient(ellipse at 15% 85%, rgba(110,130,255,0.45) 0%, transparent 52%)`,
    bgSize: '22px 22px, auto',
    ghost: 'rgba(255,255,255,0.055)',
    label: 'rgba(245,245,240,0.5)',
    body: 'rgba(245,245,240,0.5)',
    bodyMax: '360px',
    padding: { xs: '32px 28px', md: '44px 48px' },
    minHeight: { xs: '280px', sm: '300px' },
    numberSize: { xs: '22vw', sm: '15vw', md: '11vw', lg: '10vw' },
    numberSpacing: '-0.04em',
    numberLine: 0.88,
    delay: 0.08,
  },
  {
    area: 'stat6',
    bg: ACCENT,
    bgImage: 'radial-gradient(rgba(13,12,12,0.14) 1.5px, transparent 1.5px)',
    bgSize: '22px 22px',
    ghost: 'rgba(13,12,12,0.065)',
    label: 'rgba(13,12,12,0.45)',
    body: 'rgba(13,12,12,0.45)',
    bodyMax: '240px',
    padding: { xs: '32px 28px', md: '40px 44px' },
    minHeight: { xs: '260px' },
    numberSize: { xs: '28vw', sm: '18vw', md: '15vw', lg: '13vw' },
    numberSpacing: '-0.05em',
    numberLine: 0.85,
    delay: 0.16,
  },
  {
    area: 'stat4',
    bg: FG_DARK,
    bgImage: 'radial-gradient(rgba(245,245,240,0.08) 1.5px, transparent 1.5px)',
    bgSize: '22px 22px',
    ghost: 'rgba(245,245,240,0.04)',
    label: 'rgba(245,245,240,0.4)',
    body: 'rgba(245,245,240,0.4)',
    bodyMax: '240px',
    padding: { xs: '32px 28px', md: '40px 44px' },
    minHeight: { xs: '260px' },
    numberSize: { xs: '28vw', sm: '18vw', md: '15vw', lg: '13vw' },
    numberSpacing: '-0.05em',
    numberLine: 0.85,
    delay: 0.24,
  },
] as const;

interface Props {
  /** Título, textos y los tres números editables desde el dashboard ("Contenido del sitio → Datos del año"). */
  content: StatsContent;
}

export function StatsLanding({ content }: Props) {
  const countRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stats = content.stats.slice(0, CARD_STYLES.length);

  useEffect(() => {
    const animate = (el: HTMLSpanElement, end: number) => {
      const proxy = { val: 0 };
      gsap.to(proxy, {
        val: end, duration: 2.4, ease: 'power3.out',
        onUpdate() { el.textContent = Math.round(proxy.val).toString(); },
      });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLSpanElement;
          animate(el, parseInt(el.dataset.target ?? '0', 10));
          observer.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -5% 0px', threshold: 0.1 },
    );
    countRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [stats]);

  return (
    <Box
      id="stats"
      component="section"
      sx={{
        backgroundColor: BG_SECTION,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: '60px', md: '80px' },
        overflow: 'hidden',
        scrollMarginTop: { xs: '64px', md: '72px' },
      }}
    >
      <Box sx={{ px: PX, width: '100%' }}>
        <Box sx={{
          display: 'grid',
          gap: { xs: '12px', md: '14px' },
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gridTemplateRows: { sm: 'auto 300px 300px', md: '400px 400px' },
          gridTemplateAreas: {
            xs: '"intro" "stat300" "stat6" "stat4"',
            sm: '"intro intro" "stat300 stat300" "stat6 stat4"',
            md: '"intro stat300 stat300" "intro stat6 stat4"',
          },
        }}>

          {/* ── INTRO ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '80px' }}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ gridArea: 'intro', height: '100%' }}
          >
            <Box sx={{
              height: '100%', position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              pr: { md: '40px', xl: '56px' },
              py: { xs: '8px', sm: '24px', md: 0 },
              gap: '20px',
            }}>
              {/* Fragmento del año recortado — decorativo */}
              <Box aria-hidden sx={{
                position: 'absolute', bottom: '-0.08em', left: '-0.08em',
                fontFamily: FONT_DISPLAY,
                fontSize: { xs: '70vw', md: '48vw', lg: '40vw' },
                fontWeight: 400, lineHeight: 1,
                color: 'rgba(13,12,12,0.032)',
                pointerEvents: 'none', userSelect: 'none', zIndex: 0,
                whiteSpace: 'nowrap',
              }}>{content.backgroundText}</Box>

              <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box sx={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: { xs: '13vw', sm: '9vw', md: '5.5vw', lg: '5vw', xl: '4.5vw' },
                  fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 1.0, color: PRIMARY,
                }}>
                  {content.title}
                </Box>
                <Box sx={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: { xs: '20px', lg: '22px' },
                  fontWeight: 400, lineHeight: 1.22, color: FG_DARK,
                }}>
                  {content.headline}
                </Box>
                <Box sx={{
                  fontFamily: FONT_BODY, fontSize: '15px',
                  color: 'rgba(13,12,12,0.5)', lineHeight: 1.72,
                }}>
                  {content.description}
                </Box>
                <Box sx={{ width: '40px', height: '3px', backgroundColor: ACCENT, borderRadius: '2px' }} />
              </Box>
            </Box>
          </motion.div>

          {/* ── TARJETAS ── */}
          {stats.map((stat, i) => {
            const s = CARD_STYLES[i];
            if (!s) return null;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.94, y: 36 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={HOVER_UP}
                viewport={{ once: true, margin: '80px' }}
                transition={{ duration: 0.8, delay: s.delay, ease: EASE }}
                style={{ gridArea: s.area, height: '100%' }}
              >
                <Box sx={{
                  height: '100%', minHeight: s.minHeight,
                  backgroundColor: s.bg,
                  backgroundImage: s.bgImage,
                  backgroundSize: s.bgSize,
                  borderRadius: '20px',
                  p: s.padding,
                  display: 'flex', flexDirection: 'column',
                  overflow: 'hidden', position: 'relative',
                }}>
                  <Box aria-hidden sx={{
                    position: 'absolute', bottom: i === 0 ? '-0.1em' : '-0.15em', right: i === 0 ? '-0.04em' : '-0.06em',
                    fontFamily: FONT_DISPLAY, fontSize: { xs: i === 0 ? '60vw' : '55vw', md: '22vw' },
                    fontWeight: 400, lineHeight: 1, color: s.ghost,
                    pointerEvents: 'none', userSelect: 'none', zIndex: 0,
                  }}>{stat.value}</Box>

                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{
                      fontFamily: FONT_BODY, fontSize: '11px', fontWeight: 700,
                      letterSpacing: '0.24em', textTransform: 'uppercase',
                      color: s.label, mb: '12px',
                    }}>{stat.label}</Box>
                    <Box sx={{
                      fontFamily: FONT_BODY, fontSize: { xs: i === 0 ? '14px' : '13px', md: i === 0 ? '15px' : '14px' },
                      color: s.body, lineHeight: 1.65, maxWidth: s.bodyMax,
                    }}>
                      {stat.description}
                    </Box>
                  </Box>

                  <Box sx={{
                    mt: 'auto', position: 'relative', zIndex: 1,
                    fontFamily: FONT_DISPLAY,
                    fontSize: s.numberSize,
                    fontWeight: 400, letterSpacing: s.numberSpacing, lineHeight: s.numberLine,
                    color: FG_LIGHT, display: 'flex', alignItems: 'flex-end',
                  }}>
                    <Box
                      component="span"
                      ref={(el: HTMLSpanElement | null) => { countRefs.current[i] = el; }}
                      data-target={String(stat.value)}
                    >
                      0
                    </Box>
                    {stat.suffix && (
                      <Box component="span" sx={{
                        color: i === 0 ? ACCENT : 'inherit',
                        fontSize: '0.45em', lineHeight: '1.4em', mb: '0.04em', ml: '4px',
                      }}>{stat.suffix}</Box>
                    )}
                  </Box>
                </Box>
              </motion.div>
            );
          })}

        </Box>
      </Box>
    </Box>
  );
}
