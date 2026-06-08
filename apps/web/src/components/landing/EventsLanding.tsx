'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import { EventSlider } from './EventSlider';
import type { PublicEvent } from '@/lib/queries/public-events';

const BG         = '#2235fd';
const BG_DARK    = '#0d0c0c';
const PRIMARY    = '#2235fd';
const MUTED_DARK = 'rgba(13,12,12,0.65)';
const EASE       = [0.76, 0, 0.24, 1] as const;

const FONT_DISPLAY = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_BODY    = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';

interface ProvinceGroup {
  province: string;
  events:   PublicEvent[];
}

function groupByProvince(events: PublicEvent[]): ProvinceGroup[] {
  const map = new Map<string, PublicEvent[]>();
  events.forEach(event => {
    const key = event.province.name;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(event);
  });
  return Array.from(map.entries()).map(([province, evts]) => ({ province, events: evts }));
}

function EmptyState() {
  return (
    <Box
      sx={{
        px:         { xs: '20px', md: '60px', xl: '80px' },
        py:         '60px',
        fontFamily: FONT_DISPLAY,
        fontSize:   { xs: '22px', md: '28px' },
        color:      'rgba(245,245,240,0.28)',
        letterSpacing: '-0.02em',
      }}
    >
      Próximamente se anunciarán los eventos.
    </Box>
  );
}

interface Props {
  events: PublicEvent[];
}

export function EventsLanding({ events }: Props) {
  const groups = useMemo(() => groupByProvince(events), [events]);
  const [activeLocationId, setActiveLocationId] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const { locationId } = (e as CustomEvent<{ locationId: number }>).detail;
      setActiveLocationId(locationId);
    };
    window.addEventListener('jm:activate-location', handler);
    return () => window.removeEventListener('jm:activate-location', handler);
  }, []);

  return (
    <Box
      id="eventos"
      component="section"
      sx={{ backgroundColor: BG, position: 'relative' }}
    >
      {/* ── Gradient header zone: #f5f5f0 → primary ── */}
      <Box
        sx={{
          background: `linear-gradient(to bottom, #f5f5f0 0%, #f5f5f0 72%, #d4d8fb 81%, #8a96f8 91%, ${BG} 100%)`,
          px: { xs: '20px', md: '60px', xl: '80px' },
          pt: { xs: '80px', md: '120px' },
          pb: { xs: '56px', md: '88px' },
        }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ marginBottom: '20px' }}
        >
          <Box
            sx={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           '12px',
              fontFamily:     FONT_BODY,
              fontSize:      '11px',
              fontWeight:     700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color:          PRIMARY,
            }}
          >
            <Box sx={{ width: '20px', height: '1.5px', backgroundColor: PRIMARY, flexShrink: 0 }} />
            Eventos
          </Box>
        </motion.div>

        {/* Headline */}
        {[
          { text: 'Próximos eventos',  color: BG_DARK, delay: 0.08 },
          { text: 'misioneros.',       color: PRIMARY,  delay: 0.2  },
        ].map(({ text, color, delay }) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.75, delay, ease: EASE }}
          >
            <Box
              sx={{
                fontFamily:    FONT_DISPLAY,
                fontSize:      { xs: '9vw', sm: '6.5vw', md: '4.5vw', lg: '4vw' },
                fontWeight:     400,
                letterSpacing: '-0.025em',
                lineHeight:     1.08,
                color,
              }}
            >
              {text}
            </Box>
          </motion.div>
        ))}

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: 'easeOut' }}
        >
          <Box
            sx={{
              mt:         '28px',
              fontFamily:  FONT_BODY,
              fontSize:   { xs: '15px', md: '17px' },
              color:       MUTED_DARK,
              lineHeight:  1.68,
              maxWidth:   '540px',
            }}
          >
            Encontrá el evento más cercano y sumate a la misión.
          </Box>
        </motion.div>
      </Box>

      {/* ── Sliders por provincia ── */}
      <Box sx={{ pt: { xs: '40px', md: '56px' }, pb: { xs: '48px', md: '72px' } }}>
        {events.length === 0 ? (
          <EmptyState />
        ) : (
          groups.map((group, gIdx) => {
            const startIndex = groups
              .slice(0, gIdx)
              .reduce((acc, g) => acc + g.events.length, 0);
            return (
              <EventSlider
                key={group.province}
                province={group.province}
                events={group.events}
                startIndex={startIndex}
                animDelay={Math.min(gIdx * 0.1, 0.3)}
                activateLocationId={activeLocationId}
              />
            );
          })
        )}
      </Box>

      {/* ── Bottom gradient: primary → #f5f5f0 ── */}
      <Box
        sx={{
          height:     { xs: '200px', md: '300px' },
          background: `linear-gradient(to bottom, ${BG} 0%, #3d50fe 8%, #6070fc 18%, #8a93fb 30%, #b0b7fa 44%, #cdd2f9 58%, #e0e3fb 70%, #ecedf8 80%, #f2f2f5 90%, #f5f5f0 100%)`,
          flexShrink:  0,
        }}
      />
    </Box>
  );
}
