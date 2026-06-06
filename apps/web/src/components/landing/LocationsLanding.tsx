'use client';

import { motion } from 'framer-motion';
import Box from '@mui/material/Box';

const BG      = '#f5f5f0';
const BG_DARK = '#0d0c0c';
const PRIMARY = '#2235fd';
const MUTED   = 'rgba(13,12,12,0.4)';
const EASE    = [0.76, 0, 0.24, 1] as const;

const FONT_DISPLAY = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_BODY    = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';

export function LocationsLanding() {
  return (
    <Box
      id="sedes"
      component="section"
      sx={{
        backgroundColor: BG,
        px: { xs: '20px', md: '60px', xl: '80px' },
        pt: { xs: '80px', md: '120px' },
        pb: { xs: '80px', md: '120px' },
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
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: FONT_BODY,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: PRIMARY,
          }}
        >
          <Box sx={{ width: '20px', height: '1.5px', backgroundColor: PRIMARY, flexShrink: 0 }} />
          Sedes
        </Box>
      </motion.div>

      {/* Headline */}
      {[
        { text: 'Donde la misión', color: BG_DARK, delay: 0.08 },
        { text: 'cobra vida.', color: PRIMARY, delay: 0.2 },
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
              fontFamily: FONT_DISPLAY,
              fontSize: { xs: '9vw', sm: '6.5vw', md: '4.5vw', lg: '4vw' },
              fontWeight: 400,
              letterSpacing: '-0.025em',
              lineHeight: 1.08,
              color,
            }}
          >
            {text}
          </Box>
        </motion.div>
      ))}

      {/* Descripción */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.7, delay: 0.32, ease: 'easeOut' }}
      >
        <Box
          sx={{
            mt: '28px',
            fontFamily: FONT_BODY,
            fontSize: { xs: '15px', md: '17px' },
            color: MUTED,
            lineHeight: 1.68,
            maxWidth: '540px',
          }}
        >
          Descubrí dónde podés sumarte y vivir la experiencia de servir.
        </Box>
      </motion.div>

      {/* Placeholder grilla de eventos — se reemplaza con datos de /api/events/public */}
      <Box
        sx={{
          mt: { xs: '52px', md: '72px' },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: '1px',
          backgroundColor: 'rgba(13,12,12,0.08)',
          border: '1px solid rgba(13,12,12,0.08)',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
          >
            <Box
              sx={{
                backgroundColor: BG,
                p: { xs: '32px 24px', md: '40px 36px' },
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'background-color 0.25s',
                '&:hover': { backgroundColor: 'rgba(13,12,12,0.04)' },
              }}
            >
              <Box
                sx={{
                  fontFamily: FONT_BODY,
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(13,12,12,0.2)',
                }}
              >
                Próximamente
              </Box>
              <Box>
                <Box
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: { xs: '22px', md: '26px' },
                    fontWeight: 400,
                    color: BG_DARK,
                    lineHeight: 1.1,
                    mb: '10px',
                  }}
                >
                  — Sede disponible
                </Box>
                <Box
                  sx={{
                    fontFamily: FONT_BODY,
                    fontSize: '13px',
                    color: MUTED,
                    letterSpacing: '0.06em',
                  }}
                >
                  Los eventos se cargan desde el dashboard
                </Box>
              </Box>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}
