'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Box from '@mui/material/Box';
import type { PublicLocation } from '@/lib/queries/public-locations';

const BG      = '#f5f5f0';
const BG_DARK = '#0d0c0c';
const PRIMARY = '#2235fd';
const ACCENT  = '#84f649';
const MUTED   = 'rgba(13,12,12,0.35)';
const LINE    = 'rgba(13,12,12,0.09)';
const EASE    = [0.76, 0, 0.24, 1] as const;

const FONT_DISPLAY = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_BODY    = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';

// ─── Agrupación por provincia ─────────────────────────────────────────────────

interface IndexedLocation {
  location: PublicLocation;
  absoluteIndex: number;
}
interface ProvinceGroup {
  province: string;
  country: string;
  items: IndexedLocation[];
}

function groupByProvince(locations: PublicLocation[]): ProvinceGroup[] {
  const map = new Map<string, ProvinceGroup>();
  locations.forEach((loc, i) => {
    const key = `${loc.province.country.name}__${loc.province.name}`;
    if (!map.has(key)) {
      map.set(key, { province: loc.province.name, country: loc.province.country.name, items: [] });
    }
    map.get(key)!.items.push({ location: loc, absoluteIndex: i });
  });
  return Array.from(map.values());
}

// ─── Cursor custom ────────────────────────────────────────────────────────────

function SectionCursor({ visible }: { visible: boolean }) {
  return (
    <motion.div
      animate={{ scale: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        border: `1.5px solid ${PRIMARY}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(245,245,240,0.1)',
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
          color: PRIMARY,
          userSelect: 'none',
        }}
      >
        VER
      </Box>
    </motion.div>
  );
}

// ─── Header de provincia ──────────────────────────────────────────────────────

function ProvinceHeader({ province, animDelay }: { province: string; animDelay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.5, delay: animDelay, ease: EASE }}
    >
      <Box
        sx={{
          mt: { xs: '44px', md: '60px' },
          mb: '4px',
          pl: '18px',
          py: '10px',
          borderLeft: `2px solid ${ACCENT}`,
        }}
      >
        <Box
          sx={{
            fontFamily: FONT_DISPLAY,
            fontSize: { xs: '6.5vw', sm: '4vw', md: '2.6vw', lg: '2.2vw' },
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: PRIMARY,
            textTransform: 'uppercase',
          }}
        >
          {province}
        </Box>
      </Box>
    </motion.div>
  );
}

// ─── Navegación hacia eventos ─────────────────────────────────────────────────

function toSlugId(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/̀-ͯ/g, '').replace(/\s+/g, '-');
}

const NAV_OFFSET = 192; // navbar height (72px) + breathing room

function navigateToEvent(locationId: number, provinceName: string): void {
  window.dispatchEvent(new CustomEvent('jm:activate-location', { detail: { locationId } }));
  setTimeout(() => {
    const el =
      document.getElementById(`slider-${toSlugId(provinceName)}`) ??
      document.getElementById('eventos');
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  }, 80);
}

// ─── Fila de localidad ────────────────────────────────────────────────────────

function LocationRow({
  location,
  absoluteIndex,
  animDelay,
  onCursorEnter,
  onCursorLeave,
  onNavigate,
  hasEvent,
}: IndexedLocation & {
  animDelay: number;
  onCursorEnter: () => void;
  onCursorLeave: () => void;
  onNavigate: () => void;
  hasEvent: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [fastClose, setFastClose] = useState(false);
  const label = String(absoluteIndex + 1).padStart(2, '0');
  const hasDetail = !!(location.title || location.description);
  const hasEvents = hasEvent;

  const handleEnter = () => { setFastClose(false); setOpen(true); if (hasDetail) onCursorEnter(); };
  const handleLeave = () => { setOpen(false); onCursorLeave(); };

  const doNavigate = () => {
    // Cierra panel instantáneo + deshabilita pointer-events en toda la sección
    setFastClose(true);
    setOpen(false);
    onCursorLeave();
    onNavigate(); // desactiva pointer-events en LocationsLanding para evitar onMouseEnter en otras filas durante el scroll
    setTimeout(() => {
      navigateToEvent(location.id, location.province.name);
      setFastClose(false);
    }, 50);
  };

  const handleClick = () => { if (hasEvents) doNavigate(); };

  const handleNavigateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    doNavigate();
  };

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
        onClick={handleClick}
        sx={{
          cursor: hasDetail ? 'none' : (hasEvents ? 'pointer' : 'default'),
          backgroundColor: open ? 'rgba(13,12,12,0.025)' : 'transparent',
          transition: 'background-color 0.28s',
        }}
      >
        {/* ── Fila default: 3 columnas ── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 2.2fr 1fr' },
            alignItems: 'center',
            gap: { xs: '10px', md: '40px' },
            py: { xs: '22px', md: '32px' },
          }}
        >
          {/* Col 1: número (se oculta al abrir) + título */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <motion.span
              animate={{ opacity: open ? 0 : 1, color: ACCENT }}
              transition={{ duration: 0.15 }}
              style={{
                fontFamily: FONT_BODY,
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: 'rgba(13,12,12,0.28)',
                flexShrink: 0,
                display: 'inline-block',
                minWidth: '28px',
              }}
            >
              {label}
            </motion.span>

            <motion.span
              animate={{ color: open ? PRIMARY : BG_DARK }}
              transition={{ duration: 0.22 }}
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 'clamp(22px, 3.2vw, 46px)',
                fontWeight: 400,
                letterSpacing: '-0.025em',
                lineHeight: 1,
              }}
            >
              {location.name}
            </motion.span>
          </Box>

          {/* Col 2: vacía en default */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }} />

          {/* Col 3: país + badge + flecha — se oculta al expandir */}
          <motion.div
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: 0.15 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px' }}
          >
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                fontFamily: FONT_BODY,
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: MUTED,
              }}
            >
              {location.province.country.name}
            </Box>

            {location._count.events > 0 && (
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  fontFamily: FONT_BODY,
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: BG_DARK,
                  backgroundColor: ACCENT,
                  px: '8px',
                  py: '4px',
                  borderRadius: '2px',
                  flexShrink: 0,
                }}
              >
                {location._count.events} evento{location._count.events !== 1 ? 's' : ''}
              </Box>
            )}

            <motion.span
              animate={{ opacity: open ? 0 : 0, y: open ? 0 : -4 }}
              transition={{ duration: 0.2 }}
              style={{ fontFamily: FONT_BODY, fontSize: '16px', color: PRIMARY, display: 'inline-block', flexShrink: 0 }}
            >
              ↓
            </motion.span>
          </motion.div>

          {/* Mobile: descripción debajo */}
          {(location.description ?? location.title) && (
            <Box
              sx={{
                display: { xs: '-webkit-box', md: 'none' },
                fontFamily: FONT_BODY,
                fontSize: '13px',
                color: MUTED,
                lineHeight: 1.65,
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {location.description ?? location.title}
            </Box>
          )}
        </Box>

        {/* ── Panel expandible: misma grilla 3 cols ── */}
        <AnimatePresence initial={false}>
          {open && hasDetail && (
            <motion.div
              key="expand"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: fastClose ? 0 : 0.35, ease: [0.4, 0, 0.2, 1] }}
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
                {/* Col 1: número gigante + título, lado a lado */}
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
                    {location.title && (
                      <Box
                        sx={{
                          fontFamily: FONT_DISPLAY,
                          fontSize: { xs: '16px', md: '20px', lg: '24px' },
                          fontWeight: 400,
                          letterSpacing: '-0.015em',
                          color: BG_DARK,
                          lineHeight: 1.15,
                        }}
                      >
                        {location.title}
                      </Box>
                    )}
                  </Box>
                </motion.div>

                {/* Col 2: descripción completa */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1, ease: EASE }}
                >
                  {location.description && (
                    <Box
                      sx={{
                        fontFamily: FONT_BODY,
                        fontSize: { xs: '15px', md: '17px', lg: '18px' },
                        color: MUTED,
                        lineHeight: 1.72,
                      }}
                    >
                      {location.description}
                    </Box>
                  )}
                </motion.div>

                {/* Col 3: país + badge + botón Ver evento */}
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
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: MUTED,
                      }}
                    >
                      {location.province.country.name}
                    </Box>
                    {hasEvents && (
                      <Box
                        component="button"
                        onClick={handleNavigateClick}
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: ACCENT,
                          border: 'none',
                          px: '14px',
                          py: '8px',
                          borderRadius: '100px',
                          fontFamily: FONT_BODY,
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: BG_DARK,
                          cursor: 'pointer',
                          flexShrink: 0,
                          transition: 'opacity 0.2s',
                          '&:hover': { opacity: 0.78 },
                        }}
                      >
                        Ver evento →
                      </Box>
                    )}
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile: botón Ver evento debajo del contenido */}
        {hasEvents && open && (
          <Box sx={{ display: { xs: 'block', md: 'none' }, pb: '20px' }}>
            <Box
              component="button"
              onClick={handleNavigateClick}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: ACCENT,
                border: 'none',
                px: '14px',
                py: '8px',
                borderRadius: '100px',
                fontFamily: FONT_BODY,
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: BG_DARK,
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 0.78 },
              }}
            >
              Ver evento →
            </Box>
          </Box>
        )}

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
      Próximamente se anunciarán las sedes.
    </Box>
  );
}

// ─── Export principal ─────────────────────────────────────────────────────────

interface Props {
  locations:              PublicLocation[];
  futureEventLocationIds: number[];
}

export function LocationsLanding({ locations, futureEventLocationIds }: Props) {
  const groups = groupByProvince(locations);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const springX = useSpring(mouseX, { stiffness: 380, damping: 38 });
  const springY = useSpring(mouseY, { stiffness: 380, damping: 38 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNavigation = () => {
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    setNavigating(true);
    navTimerRef.current = setTimeout(() => setNavigating(false), 1500);
  };

  // Disable hover interactions whenever any nav-link scroll fires
  useEffect(() => {
    const handler = () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
      setNavigating(true);
      navTimerRef.current = setTimeout(() => setNavigating(false), 1500);
    };
    window.addEventListener('jm:nav-start', handler);
    return () => window.removeEventListener('jm:nav-start', handler);
  }, []);

  return (
    <Box
      id="sedes"
      component="section"
      onMouseMove={handleMouseMove}
      sx={{
        backgroundColor: BG,
        px: { xs: '20px', md: '60px', xl: '80px' },
        pt: { xs: '80px', md: '120px' },
        pb: { xs: '80px', md: '140px' },
        position: 'relative',
        pointerEvents: navigating ? 'none' : undefined,
        scrollMarginTop: { xs: '64px', md: '72px' },
      }}
    >
      {/* Cursor custom — posición fija, controlado por spring */}
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
        <SectionCursor visible={cursorVisible} />
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
        { text: 'cobra vida.',     color: PRIMARY,  delay: 0.2  },
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

      <Box sx={{ mt: { xs: '48px', md: '72px' } }} />

      {/* Lista agrupada por provincia */}
      {locations.length === 0 ? (
        <EmptyState />
      ) : (
        <Box>
          {groups.map((group, gIdx) => (
            <Box key={`${group.country}__${group.province}`}>
              <ProvinceHeader
                province={group.province}
                animDelay={Math.min(gIdx * 0.1, 0.3)}
              />
              {group.items.map(({ location, absoluteIndex }, lIdx) => (
                <LocationRow
                  key={location.id}
                  location={location}
                  absoluteIndex={absoluteIndex}
                  animDelay={Math.min(0.05 + lIdx * 0.07, 0.35)}
                  onCursorEnter={() => setCursorVisible(true)}
                  onCursorLeave={() => setCursorVisible(false)}
                  onNavigate={handleNavigation}
                  hasEvent={futureEventLocationIds.includes(location.id)}
                />
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
