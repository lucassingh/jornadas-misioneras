'use client';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import {
  LayoutDashboard,
  Calendar,
  Globe,
  Building2,
  MapPin,
  MessageSquareQuote,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { SignOutButton } from '@clerk/nextjs';
import { useTheme } from '@mui/material/styles';
import { COLOR_TOKENS } from '@jornadas/ui';

const HEADER_HEIGHT = 64;

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Eventos', href: '/dashboard/events', icon: <Calendar size={20} /> },
  { label: 'Testimonios', href: '/dashboard/testimonials', icon: <MessageSquareQuote size={20} />, adminOnly: true },
  { label: 'Países', href: '/dashboard/countries', icon: <Globe size={20} />, adminOnly: true },
  { label: 'Provincias', href: '/dashboard/provinces', icon: <Building2 size={20} />, adminOnly: true },
  { label: 'Localidades', href: '/dashboard/locations', icon: <MapPin size={20} />, adminOnly: true },
];

interface Props {
  width: number;
  isOpen: boolean;
  isAdmin: boolean;
  userName: string;
  userEmail: string;
  userImageUrl?: string;
  onToggle: () => void;
}

export function DashboardSidebar({ width, isOpen, isAdmin, onToggle }: Props) {
  const pathname = usePathname();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const sidebarBg = theme.palette.sidebar.bg;
  const sidebarBorder = theme.palette.sidebar.border;

  const iconMuted = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(36,30,33,0.45)';
  const iconHover = isDark ? '#fff' : theme.palette.text.primary;
  const hoverBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(34,53,253,0.06)';
  const activeBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(34,53,253,0.08)';
  const inactiveText = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(36,30,33,0.6)';
  const activeColor = isDark ? COLOR_TOKENS.extra2 : COLOR_TOKENS.brand;

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width,
        bgcolor: sidebarBg,
        borderRight: `1px solid ${sidebarBorder}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 1200,
        overflow: 'hidden',
      }}
    >
      {/* Logo + toggle — altura exacta igual al header */}
      <Box
        sx={{
          height: HEADER_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isOpen ? 'space-between' : 'center',
          px: isOpen ? 2 : 1,
          flexShrink: 0,
          borderBottom: `1px solid ${sidebarBorder}`,
        }}
      >
        {isOpen ? (
          <>
            <Box
              component={Link}
              href="/"
              sx={{ position: 'relative', width: 140, height: 40, flexShrink: 0 }}
            >
              <Image
                src={isDark ? '/logos/logo_JM_bg_dark_op1.svg' : '/logos/logo_JM_bg_light_op2.svg'}
                alt="Jornadas Misioneras"
                fill
                style={{ objectFit: 'contain', objectPosition: 'left' }}
                priority
              />
            </Box>
            <Box
              onClick={onToggle}
              sx={{
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                cursor: 'pointer',
                color: iconMuted,
                flexShrink: 0,
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: hoverBg, color: iconHover },
              }}
            >
              <ChevronLeft size={16} />
            </Box>
          </>
        ) : (
          // Colapsado: el isotipo (sin texto) hace de botón para reabrir el aside
          <Box
            onClick={onToggle}
            role="button"
            aria-label="Expandir menú"
            sx={{
              position: 'relative',
              width: 32,
              height: 32,
              flexShrink: 0,
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'scale(1.08)' },
            }}
          >
            <Image
              src="/logos/logo_JM_bg_dark_op2.svg"
              alt="Jornadas Misioneras"
              fill
              style={{ objectFit: 'contain' }}
            />
          </Box>
        )}
      </Box>

      {/* Nav items */}
      <List sx={{ px: 1, py: 1.5, flex: 1, overflowY: 'auto' }}>
        {visibleItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={!isOpen ? item.label : ''} placement="right">
                <ListItemButton
                  component={Link}
                  href={item.href}
                  data-tour={`shell.aside.item.${item.href}`}
                  sx={{
                    borderRadius: 2,
                    minHeight: 42,
                    px: isOpen ? 1.5 : 1,
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    gap: 1.5,
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: isActive ? activeBg : 'transparent',
                    color: isActive ? activeColor : inactiveText,
                    '&:hover': { bgcolor: hoverBg, color: iconHover },
                    // línea izquierda SOLO cuando está abierto
                    ...(isActive && isOpen && {
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '15%',
                        height: '70%',
                        width: 3,
                        bgcolor: activeColor,
                        borderRadius: '0 4px 4px 0',
                      },
                    }),
                  }}
                >
                  <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </Box>
                  {isOpen && (
                    <Typography
                      variant="body2"
                      fontWeight={isActive ? 600 : 400}
                      sx={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                    >
                      {item.label}
                    </Typography>
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: sidebarBorder }} />

      {/* Solo cerrar sesión */}
      <Box sx={{ p: 1.5 }}>
        <SignOutButton redirectUrl="/">
          <Button
            variant="outlined"
            startIcon={<LogOut size={16} />}
            sx={{
              color: isDark ? '#fff' : theme.palette.text.primary,
              borderColor: COLOR_TOKENS.brand,
              width: isOpen ? '100%' : 'auto',
              minWidth: 0,
              '&:hover': {
                borderColor: COLOR_TOKENS.brand,
                bgcolor: `${COLOR_TOKENS.brand}33`,
              },
            }}
          >
            {isOpen ? 'Cerrar sesión' : null}
          </Button>
        </SignOutButton>
      </Box>
    </Box>
  );
}
