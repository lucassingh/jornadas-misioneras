'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import Image from 'next/image';
import Link from 'next/link';

const LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Sedes', href: '/#sedes' },
  { label: 'Contacto', href: '/#contacto' },
];

const ACCENT = '#84f649';
const FG = '#f5f5f0';       // texto sobre fondo oscuro
const BG = '#0d0c0c';
const MENU_BG = '#f5f5f0';  // fondo del menú abierto
const MENU_FG = '#0d0c0c';  // texto sobre fondo blanco
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

  // Color de los elementos del header según estado
  const headerColor = open ? MENU_FG : FG;
  const headerBg = open ? MENU_BG : scrolled ? BG : 'rgba(0,0,0,0)';

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
            maxWidth: 1400,
            mx: 'auto',
            px: { xs: '20px', md: '40px', xl: '60px' },
            height: { xs: '64px', md: '72px' },
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
          }}
        >
          {/* LEFT — Logo: oculto cuando el menú está abierto */}
          <Box
            component={Link}
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              lineHeight: 0,
              justifySelf: 'start',
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

          {/* CENTER — MENU toggle */}
          <Box
            component="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              p: '8px 16px',
              color: headerColor,
              fontFamily: FONT_BODY,
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              userSelect: 'none',
              transition: 'color 0.3s',
            }}
          >
            <span>MENU</span>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px', width: '20px', height: '14px' }}>
              <motion.span
                animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0, backgroundColor: headerColor }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ display: 'block', height: 1.5, transformOrigin: 'center' }}
              />
              <motion.span
                animate={{ opacity: open ? 0 : 1, backgroundColor: headerColor }}
                transition={{ duration: 0.2 }}
                style={{ display: 'block', height: 1.5 }}
              />
              <motion.span
                animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0, backgroundColor: headerColor }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ display: 'block', height: 1.5, transformOrigin: 'center' }}
              />
            </Box>
          </Box>

          {/* RIGHT — utility: oculto cuando el menú está abierto */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifySelf: 'end', gap: { xs: '16px', md: '28px' }, opacity: open ? 0 : 1, pointerEvents: open ? 'none' : 'auto', transition: 'opacity 0.25s' }}>
            <Box
              component={Link}
              href="/#nosotros"
              sx={{
                display: { xs: 'none', md: 'block' },
                color: headerColor,
                fontFamily: FONT_BODY,
                fontSize: '12px',
                fontWeight: 400,
                letterSpacing: '0.04em',
                textDecoration: 'none',
                opacity: 0.55,
                transition: 'opacity 0.2s, color 0.3s',
                '&:hover': { opacity: 1 },
              }}
            >
              Nosotros
            </Box>
            <Box
              component={Link}
              href="/eventos"
              sx={{
                color: open ? BG : ACCENT,
                fontFamily: FONT_BODY,
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'color 0.3s, opacity 0.2s',
                '&:hover': { opacity: 0.7 },
              }}
            >
              Inscribite →
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
            {/* BRAND NAME — una sola línea, más chico */}
            <Box
              sx={{
                pt: { xs: '84px', md: '100px' },
                px: { xs: '20px', md: '40px', xl: '60px' },
                overflow: 'hidden',
                lineHeight: 0,
              }}
            >
              <motion.div
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                exit={{ y: '105%' }}
                transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
              >
                <Box
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: { xs: '7vw', sm: '6vw', md: '5.2vw', lg: '4.5vw' },
                    fontWeight: 400,
                    letterSpacing: { xs: '-0.01em', md: '-0.02em' },
                    textTransform: 'uppercase',
                    color: MENU_FG,
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Jornadas Misioneras
                </Box>
              </motion.div>
            </Box>

            {/* DIVIDER */}
            <Box sx={{ px: { xs: '20px', md: '40px', xl: '60px' }, mt: { xs: '20px', md: '28px' } }}>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.6, delay: 0.22, ease: EASE }}
                style={{ height: 1, backgroundColor: 'rgba(13,12,12,0.14)', transformOrigin: 'left' }}
              />
            </Box>

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
              }}
            >
              {LINKS.map((link, i) => (
                <Box key={link.href} sx={{ overflow: 'hidden' }}>
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.65, delay: 0.18 + i * 0.08, ease: EASE }}
                  >
                    {/*
                     * Split-text hover:
                     * .text-front: visible por defecto, sube y desaparece al hover
                     * .text-back: arranca en top:100% (abajo, oculto), sube y aparece al hover
                     * overflow:hidden en el Link las recorta
                     */}
                    <Box
                      component={Link}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      sx={{
                        display: 'block',
                        position: 'relative',
                        overflow: 'hidden',
                        fontFamily: FONT_DISPLAY,
                        fontSize: { xs: '13vw', sm: '9.5vw', md: '8vw', lg: '7vw', xl: '6.2vw' },
                        fontWeight: 400,
                        letterSpacing: '-0.01em',
                        textTransform: 'uppercase',
                        lineHeight: 1.12,
                        textDecoration: 'none',
                        '&:hover .text-front': { transform: 'translateY(-105%)' },
                        '&:hover .text-back':  { transform: 'translateY(-105%)' },
                      }}
                    >
                      <Box
                        component="span"
                        className="text-front"
                        sx={{
                          display: 'block',
                          color: '#2235fd',
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
                borderTop: '1px solid rgba(13,12,12,0.1)',
                px: { xs: '20px', md: '40px', xl: '60px' },
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
                    component={Link}
                    href="/eventos"
                    onClick={() => setOpen(false)}
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
                      textDecoration: 'none',
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
