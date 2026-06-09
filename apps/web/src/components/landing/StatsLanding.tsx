'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import gsap from 'gsap';

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

export function StatsLanding() {
  const count300Ref = useRef<HTMLSpanElement>(null);
  const count6Ref   = useRef<HTMLSpanElement>(null);
  const count4Ref   = useRef<HTMLSpanElement>(null);

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
    [count300Ref, count6Ref, count4Ref].forEach((r) => {
      if (r.current) observer.observe(r.current);
    });
    return () => observer.disconnect();
  }, []);

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
            viewport={{ once: true, margin: '-60px' }}
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
              {/* Fragmento de "2025" recortado — decorativo */}
              <Box aria-hidden sx={{
                position: 'absolute', bottom: '-0.08em', left: '-0.08em',
                fontFamily: FONT_DISPLAY,
                fontSize: { xs: '70vw', md: '48vw', lg: '40vw' },
                fontWeight: 400, lineHeight: 1,
                color: 'rgba(13,12,12,0.032)',
                pointerEvents: 'none', userSelect: 'none', zIndex: 0,
                whiteSpace: 'nowrap',
              }}>2025</Box>

              <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box sx={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: { xs: '13vw', sm: '9vw', md: '5.5vw', lg: '5vw', xl: '4.5vw' },
                  fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 1.0, color: PRIMARY,
                }}>
                  Datos 2025
                </Box>
                <Box sx={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: { xs: '20px', lg: '22px' },
                  fontWeight: 400, lineHeight: 1.22, color: FG_DARK,
                }}>
                  El año pasado transformamos comunidades de punta a punta del país.
                </Box>
                <Box sx={{
                  fontFamily: FONT_BODY, fontSize: '15px',
                  color: 'rgba(13,12,12,0.5)', lineHeight: 1.72,
                }}>
                  No son solo estadísticas — son jóvenes que eligieron servir, provincias que recibieron esperanza y localidades que se transformaron para siempre.
                </Box>
                <Box sx={{ width: '40px', height: '3px', backgroundColor: ACCENT, borderRadius: '2px' }} />
              </Box>
            </Box>
          </motion.div>

          {/* ── 300 JÓVENES · PRIMARY + radial glow ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 36 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={HOVER_UP}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
            style={{ gridArea: 'stat300', height: '100%' }}
          >
            <Box sx={{
              height: '100%', minHeight: { xs: '280px', sm: '300px' },
              backgroundColor: PRIMARY,
              backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 1.5px, transparent 1.5px), radial-gradient(ellipse at 15% 85%, rgba(110,130,255,0.45) 0%, transparent 52%)`,
              backgroundSize: '22px 22px, auto',
              borderRadius: '20px',
              p: { xs: '32px 28px', md: '44px 48px' },
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden', position: 'relative',
            }}>
              <Box aria-hidden sx={{
                position: 'absolute', bottom: '-0.1em', right: '-0.04em',
                fontFamily: FONT_DISPLAY, fontSize: { xs: '60vw', md: '22vw' },
                fontWeight: 400, lineHeight: 1, color: 'rgba(255,255,255,0.055)',
                pointerEvents: 'none', userSelect: 'none', zIndex: 0,
              }}>300</Box>

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{
                  fontFamily: FONT_BODY, fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: 'rgba(245,245,240,0.5)', mb: '12px',
                }}>Jóvenes movilizados</Box>
                <Box sx={{
                  fontFamily: FONT_BODY, fontSize: { xs: '14px', md: '15px' },
                  color: 'rgba(245,245,240,0.5)', lineHeight: 1.65, maxWidth: '360px',
                }}>
                  Jóvenes que eligieron salir de su zona de confort para servir y transformar comunidades a lo largo del país.
                </Box>
              </Box>

              <Box sx={{
                mt: 'auto', position: 'relative', zIndex: 1,
                fontFamily: FONT_DISPLAY,
                fontSize: { xs: '22vw', sm: '15vw', md: '11vw', lg: '10vw' },
                fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 0.88,
                color: FG_LIGHT, display: 'flex', alignItems: 'flex-end',
              }}>
                <Box component="span" ref={count300Ref} data-target="300">0</Box>
                <Box component="span" sx={{
                  color: ACCENT, fontSize: '0.45em', lineHeight: '1.4em', mb: '0.04em', ml: '4px',
                }}>+</Box>
              </Box>
            </Box>
          </motion.div>

          {/* ── 6 LOCALIDADES · ACCENT + dot grid ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 36 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={HOVER_UP}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.16, ease: EASE }}
            style={{ gridArea: 'stat6', height: '100%' }}
          >
            <Box sx={{
              height: '100%', minHeight: { xs: '260px' },
              backgroundColor: ACCENT,
              backgroundImage: 'radial-gradient(rgba(13,12,12,0.14) 1.5px, transparent 1.5px)',
              backgroundSize: '22px 22px',
              borderRadius: '20px',
              p: { xs: '32px 28px', md: '40px 44px' },
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden', position: 'relative',
            }}>
              <Box aria-hidden sx={{
                position: 'absolute', bottom: '-0.15em', right: '-0.06em',
                fontFamily: FONT_DISPLAY, fontSize: { xs: '55vw', md: '22vw' },
                fontWeight: 400, lineHeight: 1, color: 'rgba(13,12,12,0.065)',
                pointerEvents: 'none', userSelect: 'none',
              }}>6</Box>

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{
                  fontFamily: FONT_BODY, fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: 'rgba(13,12,12,0.45)', mb: '12px',
                }}>Localidades alcanzadas</Box>
                <Box sx={{
                  fontFamily: FONT_BODY, fontSize: { xs: '13px', md: '14px' },
                  color: 'rgba(13,12,12,0.45)', lineHeight: 1.65, maxWidth: '240px',
                }}>
                  De norte a sur, comunidades que recibieron esperanza y servicio concreto.
                </Box>
              </Box>

              <Box sx={{
                mt: 'auto', position: 'relative', zIndex: 1,
                fontFamily: FONT_DISPLAY,
                fontSize: { xs: '28vw', sm: '18vw', md: '15vw', lg: '13vw' },
                fontWeight: 400, letterSpacing: '-0.05em', lineHeight: 0.85,
                color: FG_LIGHT,
              }}>
                <Box component="span" ref={count6Ref} data-target="6">0</Box>
              </Box>
            </Box>
          </motion.div>

          {/* ── 4 PROVINCIAS · DARK + diagonal hatch ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 36 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={HOVER_UP}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
            style={{ gridArea: 'stat4', height: '100%' }}
          >
            <Box sx={{
              height: '100%', minHeight: { xs: '260px' },
              backgroundColor: FG_DARK,
              backgroundImage: 'radial-gradient(rgba(245,245,240,0.08) 1.5px, transparent 1.5px)',
              backgroundSize: '22px 22px',
              borderRadius: '20px',
              p: { xs: '32px 28px', md: '40px 44px' },
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden', position: 'relative',
            }}>
              <Box aria-hidden sx={{
                position: 'absolute', bottom: '-0.15em', right: '-0.06em',
                fontFamily: FONT_DISPLAY, fontSize: { xs: '55vw', md: '22vw' },
                fontWeight: 400, lineHeight: 1, color: 'rgba(245,245,240,0.04)',
                pointerEvents: 'none', userSelect: 'none',
              }}>4</Box>

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{
                  fontFamily: FONT_BODY, fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: 'rgba(245,245,240,0.4)', mb: '12px',
                }}>Provincias de Argentina</Box>
                <Box sx={{
                  fontFamily: FONT_BODY, fontSize: { xs: '13px', md: '14px' },
                  color: 'rgba(245,245,240,0.4)', lineHeight: 1.65, maxWidth: '240px',
                }}>
                  Cuatro provincias, una sola misión: llevar esperanza a cada rincón del país.
                </Box>
              </Box>

              <Box sx={{
                mt: 'auto', position: 'relative', zIndex: 1,
                fontFamily: FONT_DISPLAY,
                fontSize: { xs: '28vw', sm: '18vw', md: '15vw', lg: '13vw' },
                fontWeight: 400, letterSpacing: '-0.05em', lineHeight: 0.85,
                color: FG_LIGHT,
              }}>
                <Box component="span" ref={count4Ref} data-target="4">0</Box>
              </Box>
            </Box>
          </motion.div>

        </Box>
      </Box>
    </Box>
  );
}
