'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Image from 'next/image';

const ACCENT = '#84f649';
const FG = '#f5f5f0';
const BG = '#0d0c0c';
const PRIMARY = '#2235fd';
const EASE = [0.76, 0, 0.24, 1] as const;
const FONT_DISPLAY = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_BODY = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';

const HEADLINE = [
  { text: 'El impacto', color: FG,      delay: 0.5  },
  { text: 'de sumarte', color: PRIMARY, delay: 0.65 },
];

// Más chico que antes — deja subir la imagen y mostrar más porción al cargar.
const HEADLINE_SIZE = { xs: '11.5vw', sm: '10vw', md: '9vw', lg: '7.8vw', xl: '7vw' };

// Mismo valor para el padding horizontal y el espacio debajo de la imagen —
// la foto queda "enmarcada" con aire igual a los costados y abajo.
const SECTION_PX = { xs: '20px', md: '60px', xl: '80px' };

const SLIDES = ['/hero/img-1.webp', '/hero/img-2.webp', '/hero/img-3.webp'];
const SLIDE_INTERVAL_MS = 6000;
const SLIDE_FADE_S = 3;

// PageLoader (fixed overlay, z-index 9998) covers the whole screen for its
// own GSAP timeline: 3× 0.45s pulse + 0.7s move-to-navbar, with the overlay
// fade overlapping the last 0.3s of that move — it clears at ~2.2s. Any
// entrance animation that starts on mount plays out entirely behind it, so
// by the time it lifts the hero already looks static. Gate the reveal on
// this instead of firing blind at t=0.
const LOADER_CLEAR_MS = 2250;

export function HeroLanding() {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), LOADER_CLEAR_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        backgroundColor: BG,
        overflow: 'hidden',
        pt: { xs: '92px', md: '132px' },
        px: SECTION_PX,
        pb: SECTION_PX,
      }}
    >
      {/* ── TEXTO — arriba, alineado a la izquierda ── */}
      <Box sx={{ mb: { xs: '24px', sm: '32px', md: '40px' } }}>
        {/* Eyebrow */}
        <Box sx={{ overflow: 'hidden', mb: { xs: '16px', md: '22px' } }}>
          <motion.div
            initial={{ y: '100%' }}
            animate={ready ? { y: '0%' } : { y: '100%' }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: FONT_BODY,
                fontSize: { xs: '11px', md: '12px' },
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: ACCENT,
              }}
            >
              <Box sx={{ width: '28px', height: '1.5px', backgroundColor: ACCENT, flexShrink: 0 }} />
              Jornadas Misioneras
            </Box>
          </motion.div>
        </Box>

        {/* Headline — línea por línea, mask reveal + blur-to-foco y un leve
            overshoot de escala; la entrada "grande" que pide un hero premium */}
        {HEADLINE.map(({ text, color, delay }) => (
          <Box key={text} sx={{ overflow: 'hidden', py: '0.06em' }}>
            <motion.div
              initial={{ y: '105%', opacity: 0, scale: 1.06, filter: 'blur(14px)' }}
              animate={
                ready
                  ? { y: '0%', opacity: 1, scale: 1, filter: 'blur(0px)' }
                  : { y: '105%', opacity: 0, scale: 1.06, filter: 'blur(14px)' }
              }
              transition={{ duration: 1.15, delay, ease: EASE }}
              style={{ transformOrigin: 'left bottom' }}
            >
              <Box
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: HEADLINE_SIZE,
                  fontWeight: 400,
                  letterSpacing: { xs: '-0.01em', md: '-0.025em' },
                  color,
                  lineHeight: 0.93,
                  whiteSpace: 'nowrap',
                }}
              >
                {text}
              </Box>
            </motion.div>
          </Box>
        ))}

        {/* Subtítulo + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.7, delay: 0.88, ease: 'easeOut' }}
        >
          <Box
            sx={{
              mt: { xs: '28px', md: '36px' },
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: { xs: '24px', sm: '48px' },
            }}
          >
            <Box
              sx={{
                fontFamily: FONT_BODY,
                fontSize: { xs: '14px', md: '16px' },
                fontWeight: 400,
                color: 'rgba(245,245,240,0.6)',
                maxWidth: '400px',
                lineHeight: 1.65,
                letterSpacing: '0.01em',
              }}
            >
              Viví una experiencia que transforma tu fe
              <br />y tu mirada sobre el servicio.
            </Box>

            <Box
              component="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('jm:nav-start'));
                window.scrollTo({ top: window.scrollY, left: window.scrollX });
                requestAnimationFrame(() => {
                  const el = document.getElementById('eventos');
                  if (!el) return;
                  const navH = window.innerWidth >= 900 ? 72 : 64;
                  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
                });
              }}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: ACCENT,
                color: BG,
                px: { xs: '24px', md: '28px' },
                py: { xs: '13px', md: '15px' },
                fontFamily: FONT_BODY,
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background-color 0.25s, gap 0.25s',
                '&:hover': { backgroundColor: '#a3ff6e', gap: '16px' },
              }}
            >
              Inscribite
              <Box component="span" sx={{ fontSize: '16px' }}>→</Box>
            </Box>
          </Box>
        </motion.div>
      </Box>

      {/* ── IMAGEN — box propio, sin overlay, entra desde abajo. Gateado por
          `ready` igual que el texto (ver LOADER_CLEAR_MS): como la imagen
          ya asoma en el viewport inicial por el diseño "cortado", un gate
          por scroll (whileInView) no hacía falta — el problema real era el
          loader, no la posición. Adentro, un slider automático a fade entre
          3 fotos, fijo en el lugar — no se desliza, una se apaga mientras
          la otra aparece. ── */}
      <motion.div
        initial={{ y: 110, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: 110, opacity: 0 }}
        transition={{ duration: 1.1, delay: 1, ease: EASE }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: '58vh', sm: '68vh', md: '80vh' },
            borderRadius: { xs: '16px', md: '24px' },
            overflow: 'hidden',
          }}
        >
          {SLIDES.map((src, i) => (
            <motion.div
              key={src}
              animate={{ opacity: active === i ? 1 : 0 }}
              transition={{ duration: SLIDE_FADE_S, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <Image
                src={src}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                style={{ objectFit: 'cover', filter: 'brightness(1.08) contrast(1.06) saturate(1.15)' }}
              />
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Box>
  );
}
