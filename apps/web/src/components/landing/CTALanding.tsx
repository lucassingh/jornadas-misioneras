'use client';

import { useRef } from 'react';
import Box from '@mui/material/Box';
import {
  motion, useInView,
  useMotionValue, useSpring, useTransform,
} from 'framer-motion';
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

const BR = [
  ['42% 58% 58% 42%/42% 42% 58% 58%', '62% 38% 38% 62%/62% 58% 42% 38%', '52% 48% 38% 62%/46% 54% 44% 56%', '42% 58% 58% 42%/42% 42% 58% 58%'],
  ['62% 38% 44% 56%/56% 44% 56% 44%', '38% 62% 56% 44%/44% 56% 44% 56%', '50% 50% 62% 38%/62% 38% 50% 50%', '62% 38% 44% 56%/56% 44% 56% 44%'],
  ['50% 50% 30% 70%/50% 30% 70% 50%', '30% 70% 70% 30%/70% 50% 30% 70%', '70% 30% 50% 50%/30% 70% 50% 50%', '50% 50% 30% 70%/50% 30% 70% 50%'],
  ['72% 28% 52% 48%/32% 62% 38% 68%', '28% 72% 48% 52%/62% 32% 68% 38%', '52% 48% 28% 72%/48% 52% 62% 38%', '72% 28% 52% 48%/32% 62% 38% 68%'],
];

export function CTALanding() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inView     = useInView(contentRef, { once: true, margin: '80px' });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx   = useSpring(rawX, { stiffness: 50, damping: 18 });
  const my   = useSpring(rawY, { stiffness: 50, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width  - 0.5);
    rawY.set((e.clientY - rect.top)  / rect.height - 0.5);
  };
  const handleMouseLeave = () => { rawX.set(0); rawY.set(0); };

  const b1x = useTransform(mx, v => v *  62);
  const b1y = useTransform(my, v => v *  50);
  const b2x = useTransform(mx, v => v * -50);
  const b2y = useTransform(my, v => v * -40);
  const b3x = useTransform(mx, v => v *  85);
  const b3y = useTransform(my, v => v *  68);
  const b4x = useTransform(mx, v => v * -35);
  const b4y = useTransform(my, v => v *  46);

  return (
    <Box
      ref={sectionRef}
      id="cta"
      component="section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      sx={{
        backgroundColor: BG,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        // clip solo horizontal (evita scroll) pero DEJA que los blobs
        // sangren verticalmente fuera de la sección → sin línea dura
        overflowX: 'clip',
        overflowY: 'visible',
        px: { xs: '24px', sm: '40px', md: '80px', xl: '100px' },
        py: { xs: '80px', md: '100px' },
      }}
    >
      {/* Blob container: sin overflow:hidden para que el blur sangre
          suavemente más allá del top/bottom de la sección.
          La sección tiene overflowX:clip → contiene el escape horizontal.
          maskImage solo en el eje X → fade izquierdo sin corte vertical. */}
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: '-120px',    // sobresale 120px arriba de la sección
          bottom: '-120px', // sobresale 120px abajo de la sección
          width: '82%',
          overflow: 'visible', // NO clipa → el blur difumina los bordes naturalmente
          maskImage:       'linear-gradient(to right, transparent 0%, black 32%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 32%)',
          zIndex: 1,
        }}
      >
        {/* Blob 1 — PRIMARY, top zone */}
        <motion.div
          style={{
            x: b1x, y: b1y,
            position: 'absolute',
            top: '-10%', right: '-12%',
            width: '85%', height: '120%',
            background: `radial-gradient(ellipse at 55% 35%, ${PRIMARY} 0%, ${PRIMARY}cc 28%, ${PRIMARY}44 56%, transparent 72%)`,
            filter: 'blur(80px)',
            opacity: 0.82,
            pointerEvents: 'none',
          }}
          animate={{ borderRadius: BR[0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Blob 2 — ACCENT, bottom zone */}
        <motion.div
          style={{
            x: b2x, y: b2y,
            position: 'absolute',
            top: '-8%', right: '-18%',
            width: '85%', height: '120%',
            background: `radial-gradient(ellipse at 45% 65%, ${ACCENT} 0%, ${ACCENT}cc 30%, ${ACCENT}44 58%, transparent 74%)`,
            filter: 'blur(90px)',
            opacity: 0.78,
            pointerEvents: 'none',
          }}
          animate={{ borderRadius: BR[1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        {/* Blob 3 — mix ACCENT→PRIMARY, centro */}
        <motion.div
          style={{
            x: b3x, y: b3y,
            position: 'absolute',
            top: '0%', right: '-5%',
            width: '70%', height: '100%',
            background: `radial-gradient(ellipse at 50% 50%, ${ACCENT}ee 0%, ${PRIMARY}99 44%, transparent 70%)`,
            filter: 'blur(75px)',
            opacity: 0.70,
            pointerEvents: 'none',
          }}
          animate={{ borderRadius: BR[2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 3.5 }}
        />

        {/* Blob 4 — PRIMARY→ACCENT, más al interior del contenedor */}
        <motion.div
          style={{
            x: b4x, y: b4y,
            position: 'absolute',
            top: '5%', right: '18%',
            width: '55%', height: '90%',
            background: `radial-gradient(ellipse at 50% 50%, ${PRIMARY}ee 0%, ${ACCENT}88 46%, transparent 72%)`,
            filter: 'blur(82px)',
            opacity: 0.65,
            pointerEvents: 'none',
          }}
          animate={{ borderRadius: BR[3] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </Box>

      {/* ── Ghost "MISIÓN" ── */}
      <Box sx={{
        position: 'absolute',
        bottom: '-8%', right: '-3%',
        fontFamily: FONT_DISPLAY,
        fontSize: { xs: '52vw', md: '40vw' },
        fontWeight: 400, lineHeight: 0.82,
        color: `${FG_DARK}04`,
        userSelect: 'none', pointerEvents: 'none',
        whiteSpace: 'nowrap', zIndex: 3,
      }}>
        MISIÓN
      </Box>

      {/* ── Contenido principal ── */}
      <motion.div
        ref={contentRef}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.06 } } }}
        style={{ position: 'relative', zIndex: 4, maxWidth: '1020px', width: '100%' }}
      >
        <motion.div
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.65, ease: EASE } } }}
          style={{ width: '68px', height: '4px', backgroundColor: ACCENT, borderRadius: '2px', marginBottom: '32px', transformOrigin: '0% 50%' }}
        />

        <Box sx={{ overflow: 'hidden' }}>
          <motion.div variants={LINE}>
            <Box sx={{
              fontFamily: FONT_DISPLAY,
              fontSize: { xs: '13vw', sm: '10vw', md: '8.5vw', lg: '7.5vw', xl: '7vw' },
              fontWeight: 400, letterSpacing: '-0.032em', lineHeight: 1.04, color: FG_DARK,
            }}>
              Sumate a
            </Box>
          </motion.div>
        </Box>

        <Box sx={{ overflow: 'hidden', mb: { xs: '24px', md: '40px' } }}>
          <motion.div variants={LINE}>
            <Box sx={{
              fontFamily: FONT_DISPLAY,
              fontSize: { xs: '13vw', sm: '10vw', md: '8.5vw', lg: '7.5vw', xl: '7vw' },
              fontWeight: 400, letterSpacing: '-0.032em', lineHeight: 1.04, color: PRIMARY,
            }}>
              la misión.
            </Box>
          </motion.div>
        </Box>

        <motion.div variants={FADE}>
          <Box sx={{
            fontFamily: FONT_BODY, fontSize: { xs: '15px', md: '18px' },
            color: `${FG_DARK}6a`, lineHeight: 1.68, maxWidth: '480px',
            mb: { xs: '44px', md: '60px' },
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
              width: '100%', maxWidth: { xs: '100%', md: '640px' },
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
            <Box sx={{ fontFamily: FONT_DISPLAY, fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1, fontSize: { xs: '18px', sm: '22px', md: '26px' } }}>
              Ver próximos eventos
            </Box>
            <Box className="arrow-icon"><ArrowRight size={28} strokeWidth={2.2} /></Box>
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  );
}
