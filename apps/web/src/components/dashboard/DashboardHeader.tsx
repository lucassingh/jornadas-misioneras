'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { SunMedium, MoonStar, Menu } from 'lucide-react';
import { useColorMode } from '@/context/ColorModeContext';
import { useTheme } from '@mui/material/styles';
import { useClerk } from '@clerk/nextjs';
import { COLOR_TOKENS } from '@jornadas/ui';

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
            sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } }}
          >
            <Menu size={20} />
          </IconButton>
        </Tooltip>

        <Box flex={1} />

        <Tooltip title={mode === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
          <IconButton
            onClick={toggleColorMode}
            size="small"
            sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } }}
          >
            {mode === 'dark' ? <SunMedium size={20} /> : <MoonStar size={20} />}
          </IconButton>
        </Tooltip>

        {/* Separador corto, no llega al top ni al bottom */}
        <Box sx={{ width: '1px', height: 24, bgcolor: 'rgba(255,255,255,0.15)', mx: 1 }} />

        <Tooltip title="Mi perfil">
          <Box
            onClick={() => openUserProfile()}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              borderRadius: 2,
              py: 0.5,
              px: 1,
              transition: 'background 0.15s',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
            }}
          >
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" fontWeight={600} color="#fff" lineHeight={1.2}>
                {userName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
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
