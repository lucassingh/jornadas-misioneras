'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import { EventCard } from './EventCard';
import type { PublicEvent } from '@/lib/queries/public-events';

function toSlugId(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/̀-ͯ/g, '').replace(/\s+/g, '-');
}

const FONT_DISPLAY   = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_BODY      = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';
const ACCENT         = '#84f649';
const FG             = '#f5f5f0';
const EASE           = [0.76, 0, 0.24, 1] as const;
const CARD_GAP       = 10;
const EXPANDED_RATIO = 0.62;
const MIN_COLLAPSED  = 60;

function getLeftPadding(): number {
  if (typeof window === 'undefined') return 60;
  const vw = window.innerWidth;
  if (vw < 600) return 20;
  if (vw < 1536) return 60;
  return 80;
}

function computeDims(eventCount: number): { expandedW: number; collapsedW: number } {
  const vw        = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const lp        = getLeftPadding();
  const available = vw - lp * 2;
  const N         = eventCount;
  const isMobile  = vw < 768;

  if (N <= 1) return { expandedW: available, collapsedW: 0 };

  const ratio      = isMobile ? 0.82 : EXPANDED_RATIO;
  const expandedW  = Math.round(available * ratio);
  const totalGaps  = (N - 1) * CARD_GAP;
  const collapsedW = Math.max(
    MIN_COLLAPSED,
    Math.round((available - expandedW - totalGaps) / (N - 1)),
  );
  return { expandedW, collapsedW };
}

interface Props {
  province:           string;
  events:             PublicEvent[];
  startIndex:         number;
  animDelay?:         number;
  activateLocationId?: number | null;
}

export function EventSlider({ province, events, startIndex, animDelay = 0, activateLocationId }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dims, setDims] = useState(() => computeDims(events.length));

  useEffect(() => {
    setDims(computeDims(events.length));
    const onResize = () => setDims(computeDims(events.length));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [events.length]);

  useEffect(() => {
    if (activateLocationId == null) return;
    const idx = events.findIndex(ev => ev.location.id === activateLocationId);
    if (idx !== -1) setActiveIndex(idx);
  }, [activateLocationId, events]);

  return (
    <motion.div
      id={`slider-${toSlugId(province)}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: animDelay, ease: EASE }}
    >
      <Box sx={{ mb: { xs: '52px', md: '68px' } }}>
        {/* Province label */}
        <Box
          sx={{
            display:    'flex',
            alignItems: 'center',
            gap:        '16px',
            mb:         '20px',
            px:         { xs: '20px', md: '60px', xl: '80px' },
          }}
        >
          <Box sx={{ width: '24px', height: '2px', backgroundColor: ACCENT, flexShrink: 0 }} />
          <Box
            sx={{
              fontFamily:    FONT_DISPLAY,
              fontSize:      { xs: '18px', md: '22px', lg: '26px' },
              fontWeight:     400,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              color:          FG,
              lineHeight:     1,
            }}
          >
            {province}
          </Box>
        </Box>

        {/* Horizontal track */}
        <Box
          sx={{
            display:        'flex',
            gap:            `${CARD_GAP}px`,
            overflowX:      'auto',
            px:             { xs: '20px', md: '60px', xl: '80px' },
            pb:             '4px',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {events.map((event, i) => (
            <EventCard
              key={event.id}
              event={event}
              index={startIndex + i}
              isActive={i === activeIndex}
              expandedW={dims.expandedW}
              collapsedW={dims.collapsedW}
              onActivate={() => setActiveIndex(i)}
            />
          ))}
        </Box>
      </Box>
    </motion.div>
  );
}
