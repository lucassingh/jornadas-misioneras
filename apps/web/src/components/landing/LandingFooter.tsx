'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Box from '@mui/material/Box';
import Image from 'next/image';
import Link from 'next/link';

const ACCENT = '#84f649';
const FG = '#f5f5f0';
const BG = '#0d0c0c';
const MUTED = 'rgba(245,245,240,0.28)';
const EASE = [0.76, 0, 0.24, 1] as const;
const FONT_DISPLAY = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_BODY = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';
const PX = { xs: '20px', md: '60px', xl: '80px' };

const NAV_LINKS = [
  { label: 'Inicio',   sectionId: ''         },
  { label: 'Nosotros', sectionId: 'nosotros'  },
  { label: 'Sedes',    sectionId: 'sedes'     },
  { label: 'Eventos',  sectionId: 'eventos'   },
];

function getNavH(): number {
  return window.innerWidth >= 900 ? 72 : 64;
}

function scrollToSection(id: string) {
  window.dispatchEvent(new CustomEvent('jm:nav-start'));
  window.scrollTo({ top: window.scrollY, left: window.scrollX });
  requestAnimationFrame(() => {
    if (!id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - getNavH();
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  });
}

const SPLIT_SX = {
  display: 'block',
  position: 'relative' as const,
  overflow: 'hidden',
  fontFamily: FONT_BODY,
  fontSize: '14px',
  fontWeight: 400,
  letterSpacing: '0.02em',
  lineHeight: 1.4,
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover .fh-front': { transform: 'translateY(-105%)' },
  '&:hover .fh-back': { transform: 'translateY(-105%)' },
};

function SplitHoverLink({
  label,
  href,
  color = FG,
  external = false,
  onNav,
}: {
  label: string;
  href?: string;
  color?: string;
  external?: boolean;
  onNav?: () => void;
}) {
  const spans = (
    <>
      <Box
        component="span"
        className="fh-front"
        sx={{ display: 'block', color, transition: 'transform 0.45s cubic-bezier(0.76,0,0.24,1)' }}
      >
        {label}
      </Box>
      <Box
        component="span"
        className="fh-back"
        sx={{
          display: 'block',
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          color: ACCENT,
          transition: 'transform 0.45s cubic-bezier(0.76,0,0.24,1)',
        }}
      >
        {label}
      </Box>
    </>
  );

  if (onNav) {
    return (
      <Box
        component="div"
        role="button"
        tabIndex={0}
        onClick={onNav}
        onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && onNav()}
        sx={SPLIT_SX}
      >
        {spans}
      </Box>
    );
  }

  return (
    <Box
      component={external ? 'a' : Link}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      sx={SPLIT_SX}
    >
      {spans}
    </Box>
  );
}

export function LandingFooter() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, amount: 0.25 });

  const logoRef = useRef<HTMLDivElement>(null);
  const logoInView = useInView(logoRef, { once: true, amount: 0.2 });

  const scrollToTop = () => {
    window.dispatchEvent(new CustomEvent('jm:nav-start'));
    window.scrollTo({ top: window.scrollY, left: window.scrollX });
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: BG,
        color: FG,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ─── HEADLINE ─── */}
      <Box
        ref={headRef}
        sx={{
          px: PX,
          width: '100%',
          pt: { xs: '10vh', md: '18vh' },
          pb: { xs: '28px', md: '44px' },
        }}
      >
        {['Conectando fe y misión', 'en toda Latinoamérica.'].map((line, i) => (
          <Box key={i} sx={{ overflow: 'hidden' }}>
            <motion.div
              initial={{ y: '105%' }}
              animate={headInView ? { y: '0%' } : {}}
              transition={{ duration: 0.9, delay: 0.06 + i * 0.1, ease: EASE }}
            >
              <Box
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: { xs: '7vw', sm: '5vw', md: '3.6vw', lg: '3.1vw' },
                  lineHeight: 1.06,
                  letterSpacing: '-0.025em',
                  color: i === 1 ? ACCENT : FG,
                }}
              >
                {line}
              </Box>
            </motion.div>
          </Box>
        ))}
      </Box>

      {/* ─── COLUMNS ─── */}
      <Box
        sx={{
          px: PX,
          width: '100%',
          py: { xs: '24px', md: '40px' },
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
          gap: { xs: '28px 0', sm: '0' },
          borderTop: '1px solid rgba(245,245,240,0.08)',
        }}
      >
        {/* Navegar */}
        <Box>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                fontFamily: FONT_BODY,
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: MUTED,
                mb: '18px',
              }}
            >
              Navegar
            </Box>
          </motion.div>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.04 + i * 0.05, ease: EASE }}
              >
                <SplitHoverLink
                  label={link.label}
                  onNav={() => scrollToSection(link.sectionId)}
                />
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.24, ease: EASE }}
            >
              <SplitHoverLink label="Inscribite →" href="/events" color={ACCENT} />
            </motion.div>
          </Box>
        </Box>

        {/* Contacto */}
        <Box>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06 }}
          >
            <Box
              sx={{
                fontFamily: FONT_BODY,
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: MUTED,
                mb: '18px',
              }}
            >
              Contacto
            </Box>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
          >
            <Box
              component="a"
              href="mailto:jornadasmisionerasnacionales@gmail.com"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: FONT_BODY,
                fontSize: { xs: '12px', md: '13px' },
                color: FG,
                textDecoration: 'none',
                transition: 'color 0.25s',
                '&:hover': { color: ACCENT },
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6 }}>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span style={{ whiteSpace: 'nowrap' }}>jornadasmisionerasnacionales@gmail.com</span>
            </Box>
          </motion.div>
        </Box>

        {/* Redes */}
        <Box sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' } }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Box
              sx={{
                fontFamily: FONT_BODY,
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: MUTED,
                mb: '18px',
              }}
            >
              Redes
            </Box>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.14, ease: EASE }}
          >
            <Box
              component="a"
              href="https://www.instagram.com/jornadasmisionerascc"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: FONT_BODY,
                fontSize: '13px',
                color: FG,
                textDecoration: 'none',
                transition: 'color 0.25s',
                '&:hover': { color: ACCENT },
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, opacity: 0.6 }}
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
              </svg>
              @jornadasmisionerascc
            </Box>
          </motion.div>
        </Box>
      </Box>

      {/* ─── LOGO ─── fills remaining height via flex: 1 */}
      <Box
        ref={logoRef}
        sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}
      >
        {/* left: PX aligns logo with the rest of the content */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: PX,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={logoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: EASE }}
            style={{ position: 'relative', width: '100%', height: '100%' }}
          >
            <Image
              src="/logos/logo_JM_bg_dark_op1.svg"
              alt="Jornadas Misioneras"
              fill
              style={{ objectFit: 'contain', objectPosition: 'left bottom' }}
            />
          </motion.div>
        </Box>
      </Box>

      {/* ─── BOTTOM BAR ─── */}
      <Box
        sx={{
          px: PX,
          py: { xs: '18px', md: '22px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <Box
          sx={{
            fontFamily: FONT_BODY,
            fontSize: { xs: '10px', md: '11px' },
            color: MUTED,
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}
        >
          © {new Date().getFullYear()} Jornadas Misioneras
        </Box>

        <Box
          component="button"
          onClick={scrollToTop}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: FONT_BODY,
            fontSize: { xs: '10px', md: '11px' },
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: FG,
            transition: 'color 0.25s',
            p: 0,
            '&:hover': { color: ACCENT },
            '&:hover .btt-arrow': { transform: 'translateY(-4px)' },
          }}
        >
          Back to Top
          <Box
            component="span"
            className="btt-arrow"
            sx={{ display: 'inline-block', transition: 'transform 0.3s ease', lineHeight: 1 }}
          >
            ↑
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '12px', md: '20px' } }}>
          <Box
            component={Link}
            href="/terminos"
            sx={{
              fontFamily: FONT_BODY,
              fontSize: { xs: '10px', md: '11px' },
              color: MUTED,
              letterSpacing: '0.04em',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'color 0.25s',
              '&:hover': { color: FG },
            }}
          >
            Términos
          </Box>
          <Box
            component={Link}
            href="/privacidad"
            sx={{
              fontFamily: FONT_BODY,
              fontSize: { xs: '10px', md: '11px' },
              color: MUTED,
              letterSpacing: '0.04em',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'color 0.25s',
              '&:hover': { color: FG },
            }}
          >
            Privacidad
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
