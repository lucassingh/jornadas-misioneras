'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import Image from 'next/image';
import Link from 'next/link';

const LINKS = [
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
      if (window.location.pathname !== '/') {
        window.location.href = '/';
        return;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (!el) {
      // Not on the home page — navigate there with the hash anchor
      window.location.href = `/#${id}`;
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY - getNavH();
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  });
}

const PRIMARY = '#2235fd';
const ACCENT = '#84f649';
const BG = '#0d0c0c';
const MENU_BG = '#f5f5f0';
const MENU_FG = '#0d0c0c';
const EASE = [0.76, 0, 0.24, 1] as const;
const FONT_DISPLAY = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_BODY = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';

export function NavbarLanding() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const headerBg = open ? MENU_BG : scrolled ? BG : 'rgba(0,0,0,0)';

  const burgerCircleBg = open ? BG : '#f5f5f0';
  const burgerLineColor = open ? ACCENT : PRIMARY;

  // Wait for full menu close animation (650ms) before scrolling
  const handleMenuLink = (sectionId: string) => {
    setOpen(false);
    setTimeout(() => scrollToSection(sectionId), 700);
  };

  return (
    <>
      {/* ── NAVBAR ── */}
      <motion.header
        animate={{ backgroundColor: headerBg }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1001,
          borderBottom: `1px solid ${open ? 'rgba(13,12,12,0.1)' : scrolled ? 'rgba(255,255,255,0.07)' : 'transparent'}`,
          transition: 'border-color 0.35s',
        }}
      >
        <Box
          sx={{
            px: { xs: '20px', md: '60px', xl: '80px' },
            height: { xs: '64px', md: '72px' },
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Logo — natural left edge matching section padding */}
          <Box
            component={Link}
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              lineHeight: 0,
              opacity: open ? 0 : 1,
              pointerEvents: open ? 'none' : 'auto',
              transition: 'opacity 0.25s',
            }}
          >
            <Image
              src="/logos/logo_JM_bg_dark_op1.svg"
              alt="Jornadas Misioneras"
              width={152}
              height={42}
              priority
              style={{ objectFit: 'contain', objectPosition: 'left center' }}
            />
          </Box>

          {/* Hamburger — ml: auto pushes to right edge matching section padding */}
          <Box
            component="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            sx={{
              ml: 'auto',
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: burgerCircleBg,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.3s',
              p: 0,
            }}
          >
            {/*
             * Container: 20×16px, space-between → lines at y=1, y=8, y=15 (centers).
             * For X: line1 moves Δy=+7 and line3 moves Δy=-7 → both land at y=8 (center).
             * This ensures the two diagonals cross at the exact same point.
             */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '20px', height: '16px' }}>
              <motion.span
                animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0, backgroundColor: burgerLineColor }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ display: 'block', height: 2, transformOrigin: 'center' }}
              />
              <motion.span
                animate={{ opacity: open ? 0 : 1, backgroundColor: burgerLineColor }}
                transition={{ duration: 0.2 }}
                style={{ display: 'block', height: 2 }}
              />
              <motion.span
                animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0, backgroundColor: burgerLineColor }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ display: 'block', height: 2, transformOrigin: 'center' }}
              />
            </Box>
          </Box>
        </Box>
      </motion.header>

      {/* ── FULL-PAGE MENU ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="fullmenu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.65, ease: EASE }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              backgroundColor: MENU_BG,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* NAV LINKS — split-text hover */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: '0px', md: '2px' },
                py: { xs: '20px', md: '28px' },
                pt: { xs: '84px', md: '100px' },
              }}
            >
              {LINKS.map((link, i) => (
                <Box key={link.sectionId} sx={{ overflow: 'hidden' }}>
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.65, delay: 0.18 + i * 0.08, ease: EASE }}
                  >
                    <Box
                      component="div"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleMenuLink(link.sectionId)}
                      onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleMenuLink(link.sectionId)}
                      sx={{
                        display: 'block',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        fontFamily: FONT_DISPLAY,
                        fontSize: { xs: '13vw', sm: '9.5vw', md: '8vw', lg: '7vw', xl: '6.2vw' },
                        fontWeight: 400,
                        letterSpacing: '-0.01em',
                        textTransform: 'uppercase',
                        lineHeight: 1.12,
                        userSelect: 'none',
                        '&:hover .text-front': { transform: 'translateY(-105%)' },
                        '&:hover .text-back':  { transform: 'translateY(-105%)' },
                      }}
                    >
                      <Box
                        component="span"
                        className="text-front"
                        sx={{
                          display: 'block',
                          color: PRIMARY,
                          transition: 'transform 0.52s cubic-bezier(0.76, 0, 0.24, 1)',
                        }}
                      >
                        {link.label}
                      </Box>
                      <Box
                        component="span"
                        className="text-back"
                        sx={{
                          display: 'block',
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          width: '100%',
                          color: ACCENT,
                          transition: 'transform 0.52s cubic-bezier(0.76, 0, 0.24, 1)',
                        }}
                      >
                        {link.label}
                      </Box>
                    </Box>
                  </motion.div>
                </Box>
              ))}
            </Box>

            {/* BOTTOM — contacto izq, CTA der */}
            <Box
              sx={{
                px: { xs: '20px', md: '60px', xl: '80px' },
                py: { xs: '20px', md: '28px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <Box sx={{ overflow: 'hidden' }}>
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '100%' }}
                  transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Box
                      component="a"
                      href="mailto:jornadasmisionerasnacionales@gmail.com"
                      sx={{
                        color: MENU_FG,
                        fontFamily: FONT_BODY,
                        fontSize: { xs: '11px', md: '12px' },
                        textDecoration: 'none',
                        letterSpacing: '0.02em',
                        opacity: 0.5,
                        transition: 'opacity 0.2s',
                        '&:hover': { opacity: 1 },
                      }}
                    >
                      jornadasmisionerasnacionales@gmail.com
                    </Box>
                    <Box
                      component="a"
                      href="https://www.instagram.com/jornadasmisionerascc"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: MENU_FG,
                        fontFamily: FONT_BODY,
                        fontSize: { xs: '11px', md: '12px' },
                        textDecoration: 'none',
                        letterSpacing: '0.02em',
                        opacity: 0.5,
                        transition: 'opacity 0.2s',
                        '&:hover': { opacity: 1 },
                      }}
                    >
                      @jornadasmisionerascc
                    </Box>
                  </Box>
                </motion.div>
              </Box>

              <Box sx={{ overflow: 'hidden' }}>
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '100%' }}
                  transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
                >
                  <Box
                    component="button"
                    onClick={() => handleMenuLink('eventos')}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: ACCENT,
                      color: BG,
                      px: { xs: '22px', md: '28px' },
                      py: { xs: '11px', md: '13px' },
                      fontFamily: FONT_BODY,
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.25s, gap 0.25s',
                      '&:hover': { backgroundColor: '#a3ff6e', gap: '16px' },
                    }}
                  >
                    Inscribite ahora
                    <Box component="span" sx={{ fontSize: '15px' }}>→</Box>
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
