'use client';

import { useRef } from 'react';
import Box from '@mui/material/Box';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const BG           = '#f5f5f0';
const FG_DARK      = '#0d0c0c';
const PRIMARY      = '#2235fd';
const ACCENT       = '#84f649';
const FONT_DISPLAY = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_BODY    = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';
const EASE         = [0.16, 1, 0.3, 1] as const;

const LINE = {
  hidden:  { y: '110%' },
  visible: { y: 0, transition: { duration: 0.95, ease: EASE } },
};
const FADE = {
  hidden:  { y: 28, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.75, ease: 'easeOut' as const } },
};

// JM badge 45°: círculo PRIMARY sólido + letras BG (knockout visual)
const LOGO_URL = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="-6 -6 101 101">' +
  '<g transform="rotate(45 44.44 44.44)">' +
  '<circle cx="44.44" cy="44.44" r="44.44" fill="#2235fd"/>' +
  '<path d="M41.0609 31.8005H34.3226V60.7151C34.0821 64.0228 31.8805 64.6267 30.053 64.6267C27.333 64.6267 25.6712 63.2052 25.6712 60.5334V56.3814H18.9221V60.0044C18.9221 65.9679 23.9879 70.5795 30.053 70.5795C36.118 70.5795 41.0556 66.3099 41.0556 60.1647V60.48V31.8005H41.0609Z" fill="#f5f5f0"/>' +
  '<path d="M25.6711 18.2969V25.0459H41.0555V18.2969H25.6711Z" fill="#f5f5f0"/>' +
  '<path d="M62.9433 31.8005L62.9059 31.8326L54.2705 41.9321L47.81 31.8005V33.0563L47.7566 41.7985L52.1437 48.3071H56.3973L63.0983 39.7573V70.5795H69.9488V31.8005H63.8945" fill="#f5f5f0"/>' +
  '</g>' +
  '</svg>'
)}`;

// Máscara vertical: 200px fade-in arriba + 200px fade-out abajo
// El patrón de logos nunca toca los bordes superior ni inferior de la sección
// Curva "ease-in" manual: primeras 1.5 filas casi invisibles (~3-5%), rampa rápida hasta opaco
const LOGO_MASK = [
  'linear-gradient(to bottom,',
  '  transparent            0px,',
  '  rgba(0,0,0,0.07)      84px,',   // fila 1  → 7%
  '  rgba(0,0,0,0.18)     160px,',   // fila 2  → 18%
  '  rgba(0,0,0,0.40)     280px,',   // empieza a aparecer
  '  black                480px,',   // opacidad completa
  '  black        calc(100% - 480px),',
  '  rgba(0,0,0,0.40) calc(100% - 280px),',
  '  rgba(0,0,0,0.18) calc(100% - 160px),',
  '  rgba(0,0,0,0.07)  calc(100% - 84px),',
  '  transparent           100%',
  ')',
].join(' ');

// Curva orgánica suave (single cubic) — igual que antes
// Curva espejada: zona gris en el lado DERECHO, logos en el izquierdo
const DESKTOP_PATH = 'M 100,0 L 100,100 L 45,100 C 52,72 40,46 47,0 Z';
const MOBILE_PATH  = 'M 0,0 L 100,0 L 100,65 C 72,70 55,62 50,68 C 45,74 28,65 0,68 Z';

export function CTALanding() {
  const contentRef = useRef<HTMLDivElement>(null);
  const inView     = useInView(contentRef, { once: true, margin: '80px' });

  return (
    <Box
      id="cta"
      component="section"
      sx={{
        backgroundColor: BG,
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: { xs: 'flex-start', md: 'center' },
        // En desktop: contenido en el lado derecho (zona gris) → padding izq grande
        pl: { xs: '24px', sm: '40px', md: '46vw' },
        pr: { xs: '24px', sm: '40px', md: '60px', xl: '80px' },
        pt: { xs: '72px', md: 0 },
        pb: { xs: '40px', md: 0 },
      }}
    >

      {/* ── Layer 0: patrón de logos con fade arriba/abajo ── */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url("${LOGO_URL}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '84px 84px',
          '@keyframes ctaLogoDrift': {
            '0%':   { backgroundPosition: '0px 0px' },
            '100%': { backgroundPosition: '84px 84px' },
          },
          animation: 'ctaLogoDrift 32s linear infinite',
          // Desktop: fade vertical simétrico arriba/abajo
          maskImage: LOGO_MASK,
          WebkitMaskImage: LOGO_MASK,
          // Mobile: el SVG ola corta a ~65% de altura, así que la máscara
          // arranca a aparecer ahí y tiene su propio fade arriba/abajo
          '@media (max-width: 899px)': {
            maskImage: [
              'linear-gradient(to bottom,',
              '  transparent           0%,',
              '  transparent          58%,',   // invisible hasta la ola
              '  rgba(0,0,0,0.07)     62%,',   // aparece suave
              '  rgba(0,0,0,0.30)     68%,',
              '  black                76%,',   // opaco en el centro del strip
              '  black                90%,',
              '  rgba(0,0,0,0.10)     96%,',   // fade out al final
              '  transparent         100%',
              ')',
            ].join(' '),
            WebkitMaskImage: [
              'linear-gradient(to bottom,',
              '  transparent           0%,',
              '  transparent          58%,',
              '  rgba(0,0,0,0.07)     62%,',
              '  rgba(0,0,0,0.30)     68%,',
              '  black                76%,',
              '  black                90%,',
              '  rgba(0,0,0,0.10)     96%,',
              '  transparent         100%',
              ')',
            ].join(' '),
          },
        }}
      />

      {/* ── Layer 2a: Desktop — SVG curva suave, zona gris izquierda ── */}
      <Box
        component="svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
        sx={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          zIndex: 2,
          display: { xs: 'none', md: 'block' },
          pointerEvents: 'none',
        }}
      >
        <path d={DESKTOP_PATH} fill={BG} />
      </Box>

      {/* ── Layer 2b: Mobile — ola horizontal ── */}
      <Box
        component="svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
        sx={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          zIndex: 2,
          display: { xs: 'block', md: 'none' },
          pointerEvents: 'none',
        }}
      >
        <path d={MOBILE_PATH} fill={BG} />
      </Box>

      {/* ── Contenido ── */}
      <motion.div
        ref={contentRef}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={{
          hidden:  {},
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.06 } },
        }}
        style={{ position: 'relative', zIndex: 4, width: '100%' }}
      >
        {/* Indentación izquierda consistente en desktop para separar de la curva */}
        <Box sx={{ pl: { xs: 0, md: '56px', xl: '72px' } }}>

          <motion.div
            variants={{
              hidden:  { scaleX: 0 },
              visible: { scaleX: 1, transition: { duration: 0.65, ease: EASE } },
            }}
            style={{
              width: '68px', height: '4px', backgroundColor: ACCENT,
              borderRadius: '2px', marginBottom: '48px', transformOrigin: '0% 50%',
            }}
          />

          <Box sx={{ overflow: 'hidden' }}>
            <motion.div variants={LINE}>
              <Box sx={{
                fontFamily: FONT_DISPLAY,
                fontSize: { xs: '13vw', sm: '10vw', md: '8.5vw', lg: '7.5vw', xl: '7vw' },
                fontWeight: 400, letterSpacing: '-0.032em', lineHeight: 1.04,
                color: FG_DARK, whiteSpace: 'nowrap',
              }}>
                Sumate a
              </Box>
            </motion.div>
          </Box>

          <Box sx={{ overflow: 'hidden', mb: { xs: '32px', md: '52px' } }}>
            <motion.div variants={LINE}>
              <Box sx={{
                fontFamily: FONT_DISPLAY,
                fontSize: { xs: '13vw', sm: '10vw', md: '8.5vw', lg: '7.5vw', xl: '7vw' },
                fontWeight: 400, letterSpacing: '-0.032em', lineHeight: 1.04,
                color: PRIMARY, whiteSpace: 'nowrap',
              }}>
                la misión.
              </Box>
            </motion.div>
          </Box>

          <motion.div variants={FADE}>
            <Box sx={{
              fontFamily: FONT_BODY,
              fontSize: { xs: '15px', md: '18px' },
              color: `${FG_DARK}6a`, lineHeight: 1.68,
              maxWidth: '400px',
              mb: { xs: '52px', md: '72px' },
            }}>
              Miles de jóvenes ya lo vivieron. Encontrá el evento más cercano
              y dale un nuevo sentido a tu tiempo.
            </Box>
          </motion.div>

          <motion.div variants={FADE}>
            <Box
              component="a"
              href="#eventos"
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', maxWidth: { xs: '100%', md: '480px' },
                px: { xs: '24px', md: '36px' }, py: { xs: '20px', md: '26px' },
                backgroundColor: FG_DARK, color: BG,
                borderRadius: '8px', textDecoration: 'none',
                transition: 'background-color 0.22s ease, transform 0.2s ease, box-shadow 0.22s ease',
                boxShadow: `0 2px 0 0 ${FG_DARK}`,
                '&:hover': {
                  backgroundColor: PRIMARY,
                  transform: 'translateY(-3px)',
                  boxShadow: `0 6px 0 0 ${PRIMARY}55`,
                  '& .arrow-icon': { transform: 'translateX(8px)' },
                },
                '& .arrow-icon': { transition: 'transform 0.22s ease', display: 'flex', alignItems: 'center' },
              }}
            >
              <Box sx={{
                fontFamily: FONT_DISPLAY, fontWeight: 400,
                letterSpacing: '-0.01em', lineHeight: 1,
                fontSize: { xs: '18px', sm: '22px', md: '26px' },
              }}>
                Ver próximos eventos
              </Box>
              <Box className="arrow-icon">
                <ArrowRight size={28} strokeWidth={2.2} />
              </Box>
            </Box>
          </motion.div>

        </Box>
      </motion.div>
    </Box>
  );
}
