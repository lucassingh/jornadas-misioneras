'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { gsap } from 'gsap';
import Box from '@mui/material/Box';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { PublicEvent } from '@/lib/queries/public-events';

export const CARD_H = 580;

const FONT_DISPLAY = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_BODY    = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';
const FG           = '#f5f5f0';
const ACCENT       = '#84f649';

const CARD_GRADIENTS = [
  'radial-gradient(ellipse at 72% 28%, #2e44ff 0%, #0f1e8f 55%, #080e5a 100%)',
  'radial-gradient(ellipse at 28% 68%, #1a32e0 0%, #0a1570 55%, #060d52 100%)',
  'radial-gradient(ellipse at 65% 32%, #3348ff 0%, #131fa8 55%, #0a1480 100%)',
  'radial-gradient(ellipse at 78% 22%, #2035fb 0%, #0c1a80 55%, #070f60 100%)',
  'radial-gradient(ellipse at 38% 62%, #1528c5 0%, #0d1990 55%, #080e62 100%)',
];

interface Props {
  event:      PublicEvent;
  index:      number;
  isActive:   boolean;
  expandedW:  number;
  collapsedW: number;
  onActivate: () => void;
}

export function EventCard({ event, index, isActive, expandedW, collapsedW, onActivate }: Props) {
  const router       = useRouter();
  const cardRef      = useRef<HTMLDivElement>(null);
  const expandedRef  = useRef<HTMLDivElement>(null);
  const collapsedRef = useRef<HTMLDivElement>(null);
  const mounted      = useRef(false);
  const prevDims     = useRef({ expandedW, collapsedW });

  const label      = String(index + 1).padStart(2, '0');
  const startD     = format(new Date(event.startDate), 'd MMM', { locale: es }).toUpperCase();
  const endD       = format(new Date(event.endDate),   'd MMM yyyy', { locale: es }).toUpperCase();
  const dateStr    = `${startD} – ${endD}`;
  const fallbackBg = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  useEffect(() => {
    const dimsChanged =
      prevDims.current.expandedW !== expandedW ||
      prevDims.current.collapsedW !== collapsedW;
    prevDims.current = { expandedW, collapsedW };

    const card      = cardRef.current;
    const expanded  = expandedRef.current;
    const collapsed = collapsedRef.current;
    if (!card) return;

    // On mount or when container resizes: set without animation
    if (!mounted.current || dimsChanged) {
      mounted.current = true;
      gsap.set(card, { width: isActive ? expandedW : collapsedW });
      return;
    }

    // isActive toggled → animate
    if (!expanded || !collapsed) return;
    const tl = gsap.timeline();
    if (isActive) {
      tl.to(card,      { width: expandedW,  duration: 0.65, ease: 'power3.inOut' }, 0)
        .to(collapsed, { opacity: 0,         duration: 0.2,  ease: 'power2.out'  }, 0)
        .to(expanded,  { opacity: 1,         duration: 0.3,  ease: 'power2.in'   }, 0.32);
    } else {
      tl.to(card,      { width: collapsedW, duration: 0.65, ease: 'power3.inOut' }, 0)
        .to(expanded,  { opacity: 0,         duration: 0.2,  ease: 'power2.out'  }, 0)
        .to(collapsed, { opacity: 1,         duration: 0.3,  ease: 'power2.in'   }, 0.32);
    }
    return () => { tl.kill(); };
  }, [isActive, expandedW, collapsedW]);

  const handleClick = useCallback(() => {
    if (isActive) {
      router.push(`/eventos/${event.id}`);
    } else {
      onActivate();
    }
  }, [isActive, event.id, onActivate, router]);

  return (
    <Box
      ref={cardRef}
      onClick={handleClick}
      sx={{
        width:        `${isActive ? expandedW : collapsedW}px`,
        height:       `${CARD_H}px`,
        flexShrink:    0,
        borderRadius: '25px',
        overflow:     'hidden',
        cursor:       'pointer',
        position:     'relative',
        background:    fallbackBg,
        userSelect:   'none',
      }}
    >
      {/* Cloudinary image */}
      {event.imageUrl && (
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 90vw, 60vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority={index === 0}
        />
      )}

      {/* Dark overlay */}
      <Box
        sx={{
          position:  'absolute',
          inset:      0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.06) 100%)',
          zIndex:     1,
        }}
      />

      {/* ── Collapsed ── */}
      <Box
        ref={collapsedRef}
        sx={{
          position: 'absolute',
          inset:     0,
          zIndex:    2,
          opacity:   isActive ? 0 : 1,
        }}
      >
        {/* Number badge — top left */}
        <Box
          sx={{
            position:       'absolute',
            top:            '18px',
            left:           '18px',
            fontFamily:      FONT_BODY,
            fontSize:       '10px',
            fontWeight:      700,
            letterSpacing:  '0.2em',
            color:           FG,
            backgroundColor: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(6px)',
            px:             '10px',
            py:             '5px',
            borderRadius:   '20px',
          }}
        >
          {label}
        </Box>

        {/* Title + arrow — bottom */}
        <Box
          sx={{
            position:   'absolute',
            bottom:      0,
            left:        0,
            right:       0,
            px:         '18px',
            pb:         '22px',
            display:    'flex',
            alignItems: 'flex-end',
            gap:        '10px',
          }}
        >
          <Box
            sx={{
              fontFamily:      FONT_DISPLAY,
              fontSize:        'clamp(12px, 1.1vw, 15px)',
              fontWeight:       400,
              color:            FG,
              lineHeight:       1.2,
              flex:             1,
              display:         '-webkit-box',
              WebkitLineClamp:  2,
              WebkitBoxOrient: 'vertical',
              overflow:        'hidden',
            }}
          >
            {event.title}
          </Box>

          {/* Collapsed arrow button */}
          <Box
            sx={{
              width:          '38px',
              height:         '38px',
              borderRadius:   '50%',
              backgroundColor: 'rgba(245,245,240,0.14)',
              backdropFilter: 'blur(6px)',
              border:         '1px solid rgba(245,245,240,0.22)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              color:           FG,
              fontSize:       '15px',
              flexShrink:      0,
              transition:     'background-color 0.22s, border-color 0.22s',
              '&:hover': {
                backgroundColor: 'rgba(245,245,240,0.25)',
                borderColor:     'rgba(245,245,240,0.5)',
              },
            }}
          >
            →
          </Box>
        </Box>
      </Box>

      {/* ── Expanded ── */}
      <Box
        ref={expandedRef}
        sx={{
          position: 'absolute',
          bottom:    0,
          left:      0,
          right:     0,
          zIndex:    2,
          minWidth: `${expandedW}px`,
          px:       '36px',
          pb:       '36px',
          display:  'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'flex-end',
          gap:      '24px',
          opacity:   isActive ? 1 : 0,
        }}
      >
        {/* Info */}
        <Box>
          <Box
            sx={{
              fontFamily:      FONT_DISPLAY,
              fontSize:        'clamp(24px, 2.6vw, 40px)',
              fontWeight:       400,
              letterSpacing:   '-0.025em',
              lineHeight:       1.05,
              color:            FG,
              mb:              '16px',
              display:         '-webkit-box',
              WebkitLineClamp:  2,
              WebkitBoxOrient: 'vertical',
              overflow:        'hidden',
              whiteSpace:      'normal',
            }}
          >
            {event.title}
          </Box>

          {/* Accent divider */}
          <Box sx={{ width: '28px', height: '2px', backgroundColor: ACCENT, mb: '14px' }} />

          <Box
            sx={{
              fontFamily:    FONT_BODY,
              fontSize:      '12px',
              fontWeight:     700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color:          ACCENT,
              mb:            '6px',
              whiteSpace:    'nowrap',
            }}
          >
            {dateStr}
          </Box>

          <Box
            sx={{
              fontFamily:    FONT_BODY,
              fontSize:      '12px',
              fontWeight:     700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color:         'rgba(245,245,240,0.52)',
              whiteSpace:    'nowrap',
            }}
          >
            {event.location.name} · {event.province.name}
          </Box>
        </Box>

        {/* Ver más — pill button */}
        <Box
          sx={{
            display:         'inline-flex',
            alignItems:      'center',
            gap:             '8px',
            backgroundColor: 'rgba(245,245,240,0.92)',
            backdropFilter:  'blur(8px)',
            borderRadius:    '100px',
            pl:              '18px',
            pr:              '5px',
            py:              '5px',
            flexShrink:       0,
            transition:      'background-color 0.22s',
            '&:hover': { backgroundColor: FG },
          }}
        >
          <Box
            sx={{
              fontFamily:    FONT_BODY,
              fontSize:      '11px',
              fontWeight:     700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color:         '#0d0c0c',
              whiteSpace:    'nowrap',
            }}
          >
            Inscribirme
          </Box>
          <Box
            sx={{
              width:          '34px',
              height:         '34px',
              borderRadius:   '50%',
              backgroundColor: '#0d0c0c',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              color:           FG,
              fontSize:       '15px',
              transition:     'background-color 0.22s',
              '&:hover': { backgroundColor: ACCENT },
            }}
          >
            →
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
