'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Box from '@mui/material/Box';

const BG      = '#0d0c0c';
const FG      = '#f5f5f0';
const ACCENT  = '#84f649';
const PRIMARY = '#2235fd';
const MUTED   = 'rgba(245,245,240,0.5)';
const EASE    = [0.76, 0, 0.24, 1] as const;

const FONT_DISPLAY = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_BODY    = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';

// Real iPhone mock-up SVG (vector, not raster), re-exported to
// public/about-video/iphone-frame.svg: cropped to the phone's own bounds
// and with the screen area punched fully transparent (evenodd hole through
// all four bezel layers) so it stays crisp at any size with no seam against
// the video underneath. viewBox is exactly 564×1128 — a clean 1:2 ratio.
const PHONE_RATIO = '1 / 2';

// Exact screen-hole shape from that SVG, normalized to the phone box (0–1),
// used as an objectBoundingBox clip-path on the video — this is the same
// path that punches the frame's transparent hole, so the video's visible
// edge and the frame's cutout are geometrically identical at any size.
const SCREEN_CLIP_PATH =
  'M 0.82771 0.96200 L 0.17237 0.96200 C 0.11823 0.96200 0.07433 0.94005 0.07433 0.91297 ' +
  'L 0.07433 0.08777 C 0.07433 0.06069 0.11823 0.03873 0.17237 0.03873 L 0.82771 0.03873 ' +
  'C 0.88188 0.03873 0.92578 0.06069 0.92578 0.08777 L 0.92578 0.91297 ' +
  'C 0.92578 0.94005 0.88188 0.96200 0.82771 0.96200';

const WHITE = '#ffffff';

const TITLE_LINES = [
  { text: '¿Qué son',      color: WHITE },
  { text: 'las Jornadas',  color: WHITE },
  { text: 'Misioneras?',   color: WHITE },
] as const;

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" stroke="none" />
      {muted ? (
        <path d="m16 9 5 6m0-6-5 6" />
      ) : (
        <>
          <path d="M18.5 8.5a5 5 0 0 1 0 7" />
          <path d="M21 6a9 9 0 0 1 0 12" />
        </>
      )}
    </svg>
  );
}

export function VideoLanding() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);

  const [muted, setMuted] = useState(true);

  // Mask-reveal lines start translated *outside* their own overflow:hidden
  // wrapper, which collapses their IntersectionObserver rect to zero (the
  // spec clips a target's intersection rect by clipping ancestors) — so
  // `whileInView` on the moving element itself can never fire. Track
  // visibility on the static outer block instead and drive the reveal off it.
  const textInView = useInView(textRef, { once: true, amount: 0.3 });

  useEffect(() => {
    const section = sectionRef.current;
    const video   = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const toggleSound = () => {
    setMuted((prev) => !prev);
    // Flipping `muted` inside this click handler is what lets the browser
    // treat the unmuted playback as user-initiated — calling play() here
    // (still inside the gesture) keeps it going if it was ever paused.
    videoRef.current?.play().catch(() => {});
  };

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        position: 'relative',
        backgroundColor: BG,
        overflow: 'hidden',
        px: { xs: '20px', md: '60px', xl: '80px' },
        py: { xs: '70px', md: '30px' },
        minHeight: { md: '100vh' },
        display: { md: 'flex' },
        alignItems: { md: 'center' },
      }}
    >
      {/* Iluminación ambiente — un solo halo azul desde el centro, sin tocar los bordes */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 900px 620px at 50% 50%, rgba(34,53,253,0.28), transparent 55%)',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1.15fr' },
          alignItems: 'center',
          gap: { xs: '56px', md: '40px', lg: '80px' },
          maxWidth: '1400px',
          mx: 'auto',
        }}
      >
        {/* ── LEFT — text ── */}
        <Box ref={textRef}>
          {/* Eyebrow */}
          <Box sx={{ overflow: 'hidden', mb: { xs: '18px', md: '24px' } }}>
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: textInView ? '0%' : '100%' }}
              transition={{ duration: 0.6, ease: EASE }}
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
                Conocé la experiencia
              </Box>
            </motion.div>
          </Box>

          {/* Headline — 3 líneas, mask reveal */}
          {TITLE_LINES.map(({ text, color }, i) => (
            <Box key={text} sx={{ overflow: 'hidden' }}>
              <motion.div
                initial={{ y: '105%' }}
                animate={{ y: textInView ? '0%' : '105%' }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
              >
                <Box
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: { xs: '13vw', sm: '9vw', md: '5.2vw', lg: '4.6vw' },
                    fontWeight: 400,
                    letterSpacing: '-0.02em',
                    lineHeight: 0.98,
                    color,
                  }}
                >
                  {text}
                </Box>
              </motion.div>
            </Box>
          ))}

          {/* Descripción */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: textInView ? 1 : 0, y: textInView ? 0 : 16 }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          >
            <Box
              sx={{
                mt: { xs: '28px', md: '36px' },
                fontFamily: FONT_BODY,
                fontSize: { xs: '15px', md: '17px' },
                color: MUTED,
                lineHeight: 1.68,
                maxWidth: '440px',
              }}
            >
              Un recorrido de fe, comunidad y servicio contado por quienes lo viven.
              Dale play y descubrí qué pasa en cada Jornada.
            </Box>
          </motion.div>
        </Box>

        {/* ── RIGHT — phone mockup ── */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {/* Halo detrás del teléfono */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: { xs: '-12%', md: '-16%' },
              zIndex: 0,
              pointerEvents: 'none',
              borderRadius: '50%',
              background: `
                radial-gradient(closest-side, rgba(34,53,253,0.40), transparent 72%),
                radial-gradient(closest-side, rgba(132,246,73,0.14), transparent 70%) 65% 25% / 60% 60% no-repeat
              `,
              filter: { xs: 'blur(30px)', md: 'blur(50px)' },
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <Box
              component="button"
              type="button"
              onClick={toggleSound}
              aria-label={muted ? 'Activar sonido del video' : 'Silenciar video'}
              sx={{
                position: 'relative',
                width: { xs: '210px', sm: '250px', md: 'auto' },
                height: { xs: 'auto', md: 'clamp(480px, calc(100vh - 60px), 720px)' },
                aspectRatio: PHONE_RATIO,
                border: 'none',
                background: 'none',
                p: 0,
                cursor: 'pointer',
                display: 'block',
                '&:focus-visible': {
                  outline: `2px solid ${ACCENT}`,
                  outlineOffset: '6px',
                  borderRadius: '10%',
                },
              }}
            >
              {/* Video — recortado con la forma EXACTA del hueco de pantalla del SVG
                  (clip-path objectBoundingBox), no un inset aproximado. Insets
                  aproximados dejaban un pelito del video asomando en las esquinas
                  redondeadas del cuerpo del teléfono. */}
              <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                  <clipPath id="jm-video-screen-clip" clipPathUnits="objectBoundingBox">
                    <path d={SCREEN_CLIP_PATH} />
                  </clipPath>
                </defs>
              </svg>
              <video
                ref={videoRef}
                src="/about-video/video.mp4"
                muted={muted}
                autoPlay
                loop
                playsInline
                preload="auto"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  clipPath: 'url(#jm-video-screen-clip)',
                }}
              />

              {/* Frame del iPhone — SVG vectorial real, nítido a cualquier tamaño */}
              <img
                src="/about-video/iphone-frame.svg"
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
              />

              {/* Indicador de sonido */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '4%',
                  right: '-7%',
                  zIndex: 4,
                  width: { xs: '40px', md: '50px' },
                  height: { xs: '40px', md: '50px' },
                  borderRadius: '50%',
                  backgroundColor: muted ? PRIMARY : ACCENT,
                  color: muted ? FG : BG,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.45)',
                  transition: 'background-color 0.25s, color 0.25s',
                }}
              >
                <SpeakerIcon muted={muted} />
              </Box>
            </Box>
          </motion.div>

          {/* Hint — visible mientras está silenciado */}
          <Box sx={{ position: 'absolute', bottom: { xs: '-34px', md: '-38px' }, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 1 }}>
            <AnimatePresence>
              {muted && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      fontFamily: FONT_BODY,
                      fontSize: { xs: '10px', md: '11px' },
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'rgba(245,245,240,0.4)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Tocá el video para activar el sonido
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
