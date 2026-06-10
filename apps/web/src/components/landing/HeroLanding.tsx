'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';

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

const HEADLINE_SIZE = { xs: '14vw', sm: '12.5vw', md: '11vw', lg: '9.5vw', xl: '8.5vw' };

// Video full-bleed: fills the entire section
const VIDEO_POS = {
  position: 'absolute' as const,
  inset: 0,
};

export function HeroLanding() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: BG,
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
      }}
    >
      {/* ── VIDEO (z=0, below overlays) ── */}
      <Box sx={{ ...VIDEO_POS, zIndex: 0, overflow: 'hidden' }}>
        <video
          ref={videoRef}
          src="/videos/video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'brightness(1.4)',
          }}
        />
      </Box>

      {/* ── OVERLAYS (z=1) — apilados sobre el video full-bleed ── */}

      {/* 1. Velo oscuro uniforme para contraste de títulos */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          backgroundColor: 'rgba(13,12,12,0.38)',
        }}
      />

      {/* 2. Fade simétrico top + bottom (mismo peso visual arriba que abajo) */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: `
            linear-gradient(to bottom, ${BG} 0%, rgba(13,12,12,0.7) 12%, rgba(13,12,12,0.15) 32%, transparent 48%),
            linear-gradient(to top,    ${BG} 0%, rgba(13,12,12,0.9) 18%, rgba(13,12,12,0.25) 45%, transparent 60%)
          `,
        }}
      />

      {/* ── TEXTO ── */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          px: { xs: '20px', md: '60px', xl: '80px' },
          pb: { xs: '56px', md: '72px', xl: '88px' },
        }}
      >
        {/* Eyebrow */}
        <Box sx={{ overflow: 'hidden', mb: { xs: '16px', md: '22px' } }}>
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
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

        {/* Headline — línea por línea con mask reveal */}
        {HEADLINE.map(({ text, color, delay }) => (
          <Box key={text} sx={{ overflow: 'hidden' }}>
            <motion.div
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.82, delay, ease: EASE }}
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
          animate={{ opacity: 1, y: 0 }}
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

      {/* ── Scroll indicator ── */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: '24px', md: '32px' },
          right: { xs: '20px', md: '60px', xl: '80px' },
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <Box
            sx={{
              fontFamily: FONT_BODY,
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(245,245,240,0.35)',
              writingMode: 'vertical-rl',
              mb: '8px',
            }}
          >
            Scroll
          </Box>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
          >
            <Box sx={{ width: '1px', height: '52px', backgroundColor: 'rgba(245,245,240,0.25)' }} />
          </motion.div>
        </motion.div>
      </Box>
    </Box>
  );
}
