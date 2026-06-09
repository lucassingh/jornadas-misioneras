'use client';

import { useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import gsap from 'gsap';
import type { PublicTestimonial } from '@/lib/queries/public-testimonials';

const BG        = '#84f649'; // SECONDARY — verde
const FG_LIGHT  = '#f5f5f0';
const FG_DARK   = '#0d0c0c';
const PRIMARY   = '#2235fd';
const FONT_DISPLAY = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_BODY    = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';

// Gradients cream ↔ verde — sin stops intermedios, el browser interpola en RGB directo
const GRADIENT_TOP    = `linear-gradient(to bottom, ${FG_LIGHT} 0%, ${FG_LIGHT} 65%, ${BG} 100%)`;
const GRADIENT_BOTTOM = `linear-gradient(to bottom, ${BG} 0%, ${FG_LIGHT} 35%, ${FG_LIGHT} 100%)`;

const CARD_W   = '380px';
const CARD_H   = '210px';
const CARD_MX  = '10px';

interface Props { testimonials: PublicTestimonial[]; }

function TestimonialCard({ t }: { t: PublicTestimonial }) {
  const initials = `${t.firstName[0]}${t.lastName[0]}`.toUpperCase();
  return (
    <Box sx={{
      flexShrink: 0,
      width: CARD_W,
      height: CARD_H,
      mx: CARD_MX,
      backgroundColor: FG_LIGHT,
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.07)',
      p: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'default',
    }}>
      {/* Decorative "66" quote mark — absolute, top-right */}
      <Box sx={{
        position: 'absolute',
        top: '8px',
        right: '14px',
        fontFamily: FONT_DISPLAY,
        fontSize: '62px',
        lineHeight: 1,
        color: `${FG_DARK}0f`,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        ❝
      </Box>

      {/* Attribution row — avatar + name + event at top */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: '10px',
        flexShrink: 0, mb: '10px',
      }}>
        <Avatar
          src={t.avatarUrl ?? undefined}
          sx={{
            width: 40, height: 40, flexShrink: 0,
            fontSize: '0.8rem', fontWeight: 700,
            bgcolor: `${PRIMARY}18`, color: PRIMARY,
            border: `2px solid ${PRIMARY}22`,
          }}
        >
          {initials}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{
            fontFamily: FONT_BODY, fontSize: '13px', fontWeight: 700,
            color: FG_DARK, lineHeight: 1.2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {t.firstName} {t.lastName}
          </Box>
          <Box sx={{
            fontFamily: FONT_BODY, fontSize: '9.5px', fontWeight: 700,
            color: PRIMARY, letterSpacing: '0.11em', textTransform: 'uppercase',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            mt: '2px',
          }}>
            {t.eventName}
          </Box>
        </Box>
      </Box>

      {/* Text content — italic, fills remaining height */}
      <Box sx={{
        fontFamily: FONT_BODY,
        fontSize: '12px',
        color: `${FG_DARK}80`,
        lineHeight: 1.7,
        fontStyle: 'italic',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 5,
        WebkitBoxOrient: 'vertical',
        flex: 1,
      }}>
        "{t.content}"
      </Box>
    </Box>
  );
}

export function TestimonialsLanding({ testimonials }: Props) {
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const tween1Ref = useRef<gsap.core.Tween | null>(null);
  const tween2Ref = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const t1 = track1Ref.current;
    const t2 = track2Ref.current;
    if (!t1 || !t2) return;

    // Track has 3 identical copies → one set = total / 3
    // Using pixel values (not xPercent) avoids floating-point drift
    const set1 = t1.scrollWidth / 3;
    const set2 = t2.scrollWidth / 3;

    // Row 1 — RTL: 0 → -set1, repeat (reset to 0 is visually seamless: C1 = C2 = C3)
    gsap.set(t1, { x: 0 });
    tween1Ref.current = gsap.to(t1, {
      x: -set1, duration: 38, ease: 'none', repeat: -1,
    });

    // Row 2 — LTR: start at -set2, animate to 0, repeat (reset to -set2 is seamless)
    gsap.set(t2, { x: -set2 });
    tween2Ref.current = gsap.to(t2, {
      x: 0, duration: 44, ease: 'none', repeat: -1,
    });

    return () => {
      tween1Ref.current?.kill();
      tween2Ref.current?.kill();
    };
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <Box
      id="testimonios"
      component="section"
      sx={{
        backgroundColor: BG,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 2, // queda por encima de blobs CTA que pudieran sangrar hacia arriba
      }}
    >
      {/* Top fade: cream → verde */}
      <Box sx={{
        background: GRADIENT_TOP,
        px: { xs: '20px', md: '60px', xl: '80px' },
        pt: { xs: '80px', md: '120px' },
        pb: { xs: '56px', md: '72px' },
        flexShrink: 0,
      }}>
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: '12px',
          fontFamily: FONT_BODY, fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: PRIMARY, mb: '20px',
        }}>
          <Box sx={{ width: '20px', height: '1.5px', backgroundColor: PRIMARY, flexShrink: 0 }} />
          Testimonios
        </Box>

        <Box sx={{
          fontFamily: FONT_DISPLAY,
          fontSize: { xs: '9vw', sm: '6.5vw', md: '4.5vw', lg: '4vw' },
          fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.08,
          color: FG_DARK,
        }}>
          Lo que dicen
        </Box>
        <Box sx={{
          fontFamily: FONT_DISPLAY,
          fontSize: { xs: '9vw', sm: '6.5vw', md: '4.5vw', lg: '4vw' },
          fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.08,
          color: PRIMARY, mb: '28px',
        }}>
          los que vivieron.
        </Box>
        <Box sx={{
          fontFamily: FONT_BODY, fontSize: { xs: '15px', md: '17px' },
          color: `${FG_DARK}80`, lineHeight: 1.68, maxWidth: '520px',
        }}>
          Experiencias reales de jóvenes que eligieron servir.
        </Box>
      </Box>

      {/* Marquee rows — 3 copies each for seamless loop on any screen width */}
      <Box sx={{
        flex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        py: { xs: '28px', md: '40px' },
        gap: { xs: '16px', md: '20px' },
      }}>
        {/* Row 1 — right to left */}
        <Box
          sx={{ overflow: 'hidden' }}
          onMouseEnter={() => tween1Ref.current?.pause()}
          onMouseLeave={() => tween1Ref.current?.resume()}
        >
          <Box ref={track1Ref} sx={{ display: 'flex', width: 'max-content', willChange: 'transform' }}>
            {[0, 1, 2].map((copy) =>
              testimonials.map((t, i) => (
                <TestimonialCard key={`r1-${copy}-${i}`} t={t} />
              ))
            )}
          </Box>
        </Box>

        {/* Row 2 — left to right */}
        <Box
          sx={{ overflow: 'hidden' }}
          onMouseEnter={() => tween2Ref.current?.pause()}
          onMouseLeave={() => tween2Ref.current?.resume()}
        >
          <Box ref={track2Ref} sx={{ display: 'flex', width: 'max-content', willChange: 'transform' }}>
            {[0, 1, 2].map((copy) =>
              testimonials.map((t, i) => (
                <TestimonialCard key={`r2-${copy}-${i}`} t={t} />
              ))
            )}
          </Box>
        </Box>
      </Box>

      {/* Bottom fade: verde → cream */}
      <Box sx={{
        height: { xs: '80px', md: '120px' },
        background: GRADIENT_BOTTOM,
        flexShrink: 0,
      }} />
    </Box>
  );
}
