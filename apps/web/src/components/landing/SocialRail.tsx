'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';

const PRIMARY = '#2235fd';
const ACCENT  = '#84f649';
const FONT    = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';
const EASE    = [0.76, 0, 0.24, 1] as const;

// Sections where the rail disappears (full-width immersive layouts)
const HIDE_IDS = ['nosotros', 'testimonios'];

function IgIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

const ITEMS = [
  {
    id:       'ig',
    label:    '@jornadasmisioneras',
    href:     'https://www.instagram.com/jornadasmisionerascc',
    icon:     <IgIcon />,
    external: true,
  },
  {
    id:       'mail',
    label:    'Escribinos',
    href:     'mailto:jornadasmisionerasnacionales@gmail.com',
    icon:     <MailIcon />,
    external: false,
  },
] as const;

export function SocialRail() {
  const [ready,   setReady]   = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const keyMapRef = useRef(new Map<Element, string>());
  const inViewRef = useRef(new Set<string>());

  useEffect(() => {
    const recalc = () => setBlocked(inViewRef.current.size > 0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const key = keyMapRef.current.get(e.target) ?? '';
          if (e.isIntersecting) inViewRef.current.add(key);
          else                   inViewRef.current.delete(key);
        });
        recalc();
      },
      { threshold: 0.12 },
    );

    const watch = (el: Element, key: string) => {
      keyMapRef.current.set(el, key);
      observer.observe(el);
    };

    HIDE_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) watch(el, id);
    });

    const footer = document.querySelector('footer');
    if (footer) watch(footer, '__footer__');

    // Appear after the page loader finishes (~2.1s)
    const t = setTimeout(() => setReady(true), 2600);

    return () => { clearTimeout(t); observer.disconnect(); keyMapRef.current.clear(); };
  }, []);

  const show = ready && !blocked;

  return (
    // Only visible on md+ — footer already has the links on mobile
    <Box
      sx={{
        display:   { xs: 'none', md: 'flex' },
        // Align right edge of circles with the section horizontal padding,
        // matching the hamburger button and scroll indicator positions
        position:  'fixed',
        right:     { md: '60px', xl: '80px' },
        top:       '50%',
        transform: 'translateY(-50%)',
        zIndex:    990,
      }}
    >
      <AnimatePresence>
        {show && (
          <motion.div
            key="social-rail"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 14 }}
            transition={{ duration: 0.38, ease: EASE }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {/* top line */}
            <Box sx={{ width: '1.5px', height: '28px', backgroundColor: 'rgba(34,53,253,0.3)', mb: '8px' }} />

            {ITEMS.map(({ id, label, href, icon, external }, i) => (
              <Box
                key={id}
                sx={{
                  position:   'relative',
                  display:    'flex',
                  alignItems: 'center',
                  mb:          i < ITEMS.length - 1 ? '8px' : 0,
                }}
                onMouseEnter={() => setHoverId(id)}
                onMouseLeave={() => setHoverId(null)}
              >
                {/* slide-out label — appears to the left of the circle */}
                <AnimatePresence>
                  {hoverId === id && (
                    <motion.div
                      key="tip"
                      initial={{ opacity: 0, x: 6, width: 0 }}
                      animate={{ opacity: 1, x: 0, width: 'auto' }}
                      exit={{ opacity: 0, x: 6, width: 0 }}
                      transition={{ duration: 0.22, ease: EASE }}
                      style={{ position: 'absolute', right: '46px', overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      <Box
                        sx={{
                          fontFamily:      FONT,
                          fontSize:        '9px',
                          fontWeight:       700,
                          letterSpacing:   '0.12em',
                          textTransform:   'uppercase',
                          color:            '#f5f5f0',
                          backgroundColor:  '#0d0c0c',
                          px:              '10px',
                          py:              '5px',
                          borderRadius:    '3px',
                        }}
                      >
                        {label}
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* icon circle — dark bg works on any section background */}
                <Box
                  component="a"
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  sx={{
                    width:           '36px',
                    height:          '36px',
                    borderRadius:    '50%',
                    backgroundColor:  hoverId === id ? ACCENT : PRIMARY,
                    boxShadow:       '0 2px 16px rgba(34,53,253,0.28)',
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    color:            hoverId === id ? '#0d0c0c' : '#f5f5f0',
                    transition:      'background-color 0.22s, color 0.22s',
                    textDecoration:  'none',
                    cursor:          'pointer',
                    flexShrink:       0,
                  }}
                >
                  {icon}
                </Box>
              </Box>
            ))}

            {/* bottom line */}
            <Box sx={{ width: '1.5px', height: '28px', backgroundColor: 'rgba(34,53,253,0.3)', mt: '8px' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
