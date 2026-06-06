'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Box from '@mui/material/Box';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { PublicEvent } from '@/lib/queries/public-events';

const BG      = '#2235fd';   // primary — fondo de la sección
const FG      = '#f5f5f0';   // texto principal
const ACCENT  = '#84f649';   // verde
const MUTED   = 'rgba(245,245,240,0.45)';
const LINE    = 'rgba(245,245,240,0.12)';
const EASE    = [0.76, 0, 0.24, 1] as const;

const FONT_DISPLAY = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_BODY    = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';

function formatDateRange(start: Date, end: Date): string {
  const s = format(new Date(start), "d MMM", { locale: es });
  const e = format(new Date(end),   "d MMM yyyy", { locale: es });
  return `${s} – ${e}`;
}

// ─── Cursor custom ────────────────────────────────────────────────────────────

function EventCursor({ visible }: { visible: boolean }) {
  return (
    <motion.div
      animate={{ scale: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        border: `1.5px solid ${ACCENT}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(34,53,253,0.15)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Box
        sx={{
          fontFamily: FONT_BODY,
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: ACCENT,
          userSelect: 'none',
        }}
      >
        VER
      </Box>
    </motion.div>
  );
}

// ─── Fila de evento ───────────────────────────────────────────────────────────

function EventRow({
  event,
  index,
  animDelay,
  onCursorEnter,
  onCursorLeave,
}: {
  event: PublicEvent;
  index: number;
  animDelay: number;
  onCursorEnter: () => void;
  onCursorLeave: () => void;
}) {
  const [open, setOpen] = useState(false);
  const label = String(index + 1).padStart(2, '0');
  const hasDetail = !!(event.description || event.pricing);

  const handleEnter = () => { setOpen(true); if (hasDetail) onCursorEnter(); };
  const handleLeave = () => { setOpen(false); onCursorLeave(); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.5, delay: animDelay, ease: EASE }}
    >
      <Box
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        sx={{
          cursor: hasDetail ? 'none' : 'default',
          backgroundColor: open ? 'rgba(245,245,240,0.05)' : 'transparent',
          transition: 'background-color 0.28s',
        }}
      >
        {/* ── Fila principal: 3 columnas ── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 2.2fr 1fr' },
            alignItems: 'center',
            gap: { xs: '8px', md: '40px' },
            py: { xs: '20px', md: '28px' },
          }}
        >
          {/* Col 1: índice + título */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <motion.span
              animate={{ opacity: open ? 0 : 1 }}
              transition={{ duration: 0.15 }}
              style={{
                fontFamily: FONT_BODY,
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: 'rgba(245,245,240,0.3)',
                flexShrink: 0,
                minWidth: '28px',
                display: 'inline-block',
              }}
            >
              {label}
            </motion.span>

            <motion.span
              animate={{ color: open ? ACCENT : FG }}
              transition={{ duration: 0.22 }}
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 'clamp(20px, 3vw, 44px)',
                fontWeight: 400,
                letterSpacing: '-0.025em',
                lineHeight: 1,
              }}
            >
              {event.title}
            </motion.span>
          </Box>

          {/* Col 2: vacía en default */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }} />

          {/* Col 3: fecha + localidad — se oculta al expandir */}
          <motion.div
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: 0.15 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '4px',
            }}
          >
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                fontFamily: FONT_BODY,
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: ACCENT,
              }}
            >
              {formatDateRange(event.startDate, event.endDate)}
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                fontFamily: FONT_BODY,
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: MUTED,
              }}
            >
              {event.location.name} · {event.province.name}
            </Box>
          </motion.div>
        </Box>

        {/* ── Panel expandible: misma grilla ── */}
        <AnimatePresence initial={false}>
          {open && hasDetail && (
            <motion.div
              key="expand"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '2fr 2.2fr 1fr' },
                  gap: { xs: '16px', md: '40px' },
                  alignItems: 'center',
                  pb: { xs: '28px', md: '40px' },
                }}
              >
                {/* Col 1: número gigante + título */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.04, ease: EASE }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '12px', md: '20px' } }}>
                    <Box
                      aria-hidden
                      sx={{
                        fontFamily: FONT_DISPLAY,
                        fontSize: { xs: 'clamp(72px, 18vw, 120px)', md: 'clamp(80px, 10vw, 140px)' },
                        fontWeight: 400,
                        letterSpacing: '-0.04em',
                        lineHeight: 0.88,
                        color: ACCENT,
                        userSelect: 'none',
                        flexShrink: 0,
                      }}
                    >
                      {label}
                    </Box>
                    <Box>
                      <Box
                        sx={{
                          fontFamily: FONT_BODY,
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: ACCENT,
                          mb: '6px',
                        }}
                      >
                        {formatDateRange(event.startDate, event.endDate)}
                      </Box>
                      <Box
                        sx={{
                          fontFamily: FONT_BODY,
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          color: MUTED,
                        }}
                      >
                        {event.location.name} · {event.province.name}
                      </Box>
                    </Box>
                  </Box>
                </motion.div>

                {/* Col 2: descripción */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1, ease: EASE }}
                >
                  {event.description && (
                    <Box
                      sx={{
                        fontFamily: FONT_BODY,
                        fontSize: { xs: '15px', md: '17px', lg: '18px' },
                        color: MUTED,
                        lineHeight: 1.72,
                      }}
                    >
                      {event.description}
                    </Box>
                  )}
                </motion.div>

                {/* Col 3: precio */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.14 }}
                >
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '10px',
                    }}
                  >
                    <Box
                      sx={{
                        fontFamily: FONT_BODY,
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: FG,
                        border: `1px solid rgba(245,245,240,0.25)`,
                        px: '12px',
                        py: '6px',
                        borderRadius: '2px',
                        display: 'inline-block',
                      }}
                    >
                      {event.pricing
                        ? `Desde $${Number(event.pricing.registrationEarlyAmount).toLocaleString('es-AR')}`
                        : 'Gratuito'}
                    </Box>
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <Box sx={{ height: '1px', backgroundColor: LINE }} />
      </Box>
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <Box
      sx={{
        py: '60px',
        fontFamily: FONT_DISPLAY,
        fontSize: { xs: '22px', md: '28px' },
        color: MUTED,
        letterSpacing: '-0.02em',
      }}
    >
      Próximamente se anunciarán los eventos.
    </Box>
  );
}

// ─── Export principal ─────────────────────────────────────────────────────────

interface Props {
  events: PublicEvent[];
}

export function EventsLanding({ events }: Props) {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const springX = useSpring(mouseX, { stiffness: 380, damping: 38 });
  const springY = useSpring(mouseY, { stiffness: 380, damping: 38 });
  const [cursorVisible, setCursorVisible] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <Box
      id="eventos"
      component="section"
      onMouseMove={handleMouseMove}
      sx={{
        backgroundColor: BG,
        px: { xs: '20px', md: '60px', xl: '80px' },
        pt: { xs: '80px', md: '120px' },
        pb: { xs: '80px', md: '140px' },
        position: 'relative',
      }}
    >
      {/* Cursor custom */}
      <motion.div
        style={{
          position: 'fixed',
          left: springX,
          top: springY,
          x: '-50%',
          y: '-50%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      >
        <EventCursor visible={cursorVisible} />
      </motion.div>

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
            color: ACCENT,
          }}
        >
          <Box sx={{ width: '20px', height: '1.5px', backgroundColor: ACCENT, flexShrink: 0 }} />
          Eventos
        </Box>
      </motion.div>

      {/* Headline */}
      {[
        { text: 'Próximos eventos',  color: FG,     delay: 0.08 },
        { text: 'misioneros.',       color: ACCENT,  delay: 0.2  },
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
            mb: { xs: '48px', md: '72px' },
            fontFamily: FONT_BODY,
            fontSize: { xs: '15px', md: '17px' },
            color: MUTED,
            lineHeight: 1.68,
            maxWidth: '540px',
          }}
        >
          Encontrá el evento más cercano y sumate a la misión.
        </Box>
      </motion.div>

      {/* Lista de eventos */}
      {events.length === 0 ? (
        <EmptyState />
      ) : (
        <Box sx={{ borderTop: `1px solid ${LINE}` }}>
          {events.map((event, i) => (
            <EventRow
              key={event.id}
              event={event}
              index={i}
              animDelay={Math.min(i * 0.07, 0.35)}
              onCursorEnter={() => setCursorVisible(true)}
              onCursorLeave={() => setCursorVisible(false)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
