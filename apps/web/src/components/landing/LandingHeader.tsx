'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useColorMode } from '@/context/ColorModeContext';

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Eventos', href: '/events' },
];

export function LandingHeader() {
  const pathname = usePathname();
  const { mode, toggleColorMode } = useColorMode();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar>
        <Box
          component={Link}
          href="/"
          sx={{ position: 'relative', width: 160, height: 44, mr: 4, flexShrink: 0 }}
        >
          <Image
            src={
              mode === 'dark'
                ? '/logos/logo_JM_bg_dark_op1.svg'
                : '/logos/logo_JM_bg_light_op2.svg'
            }
            alt="Jornadas Misioneras"
            fill
            style={{ objectFit: 'contain', objectPosition: 'left' }}
            priority
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
          {navLinks.map((link) => (
            <Button
              key={link.href}
              component={Link}
              href={link.href}
              color="inherit"
              sx={{
                fontWeight: pathname === link.href ? 700 : 400,
                color: 'text.primary',
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>

        <Tooltip title={mode === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
          <IconButton onClick={toggleColorMode} sx={{ color: 'text.primary' }}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
