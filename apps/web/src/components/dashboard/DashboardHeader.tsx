'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { usePathname } from 'next/navigation';
import { SunMedium, MoonStar, Menu } from 'lucide-react';
import { useColorMode } from '@/context/ColorModeContext';
import { useTheme } from '@mui/material/styles';
import { useClerk } from '@clerk/nextjs';
import { COLOR_TOKENS } from '@jornadas/ui';
import { TourGuideMenu, getTourIdForPathname } from '@/components/tour-onboarding';

interface Props {
  userName: string;
  userEmail: string;
  userImageUrl?: string;
  onToggleSidebar: () => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}

export function DashboardHeader({ userName, userEmail, onToggleSidebar }: Props) {
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();
  const { openUserProfile } = useClerk();
  const pathname = usePathname();
  const tourId = getTourIdForPathname(pathname);
  const isDark = mode === 'dark';

  const iconColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(36,30,33,0.55)';
  const iconHover = isDark ? '#fff' : theme.palette.text.primary;
  const hoverBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(34,53,253,0.06)';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: theme.palette.sidebar.bg,
        borderBottom: `1px solid ${theme.palette.sidebar.border}`,
        zIndex: 1100,
        height: 64,
      }}
    >
      <Toolbar sx={{ gap: 1, height: 64, minHeight: '64px !important' }}>
        <Tooltip title="Toggle menú">
          <IconButton
            onClick={onToggleSidebar}
            size="small"
            sx={{ color: iconColor, '&:hover': { color: iconHover } }}
          >
            <Menu size={20} />
          </IconButton>
        </Tooltip>

        <Box flex={1} />

        {tourId && <TourGuideMenu tourId={tourId} />}

        <Tooltip title={mode === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
          <IconButton
            onClick={toggleColorMode}
            size="small"
            data-tour="shell.navbar.theme-toggle"
            sx={{ color: iconColor, '&:hover': { color: iconHover } }}
          >
            {mode === 'dark' ? <SunMedium size={20} /> : <MoonStar size={20} />}
          </IconButton>
        </Tooltip>

        {/* Separador corto, no llega al top ni al bottom */}
        <Box sx={{ width: '1px', height: 24, bgcolor: theme.palette.sidebar.border, mx: 1 }} />

        <Tooltip title="Mi perfil">
          <Box
            onClick={() => openUserProfile()}
            data-tour="shell.navbar.account"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              borderRadius: 2,
              py: 0.5,
              px: 1,
              transition: 'background 0.15s',
              '&:hover': { bgcolor: hoverBg },
            }}
          >
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" fontWeight={600} color={theme.palette.text.primary} lineHeight={1.2}>
                {userName}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {userEmail}
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                fontSize: '0.8rem',
                fontWeight: 700,
                bgcolor: COLOR_TOKENS.brand,
                color: '#fff',
                letterSpacing: 0.5,
              }}
            >
              {getInitials(userName)}
            </Avatar>
          </Box>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
