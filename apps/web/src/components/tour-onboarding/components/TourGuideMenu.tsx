'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import { Compass } from 'lucide-react';
import { COLOR_TOKENS } from '@jornadas/ui';
import { getTourSections } from '../getTourSections';
import { useTourStore } from '../store/useTourStore';
import { tourRegistry } from '../definitions';
import type { TourStartActions } from '../types';

interface TourGuideMenuProps {
  tourId: string;
  actions?: TourStartActions;
}

/**
 * Botón "Ver guía" (ícono de brújula) + desplegable con las secciones con
 * tutorial de la pantalla actual. Se renderiza en el header, al lado del
 * toggle de tema. Clickear una sección salta directo ahí (sin cartel de
 * bienvenida); "Tour completo" pasa por `openWelcome`.
 */
export function TourGuideMenu({ tourId, actions }: TourGuideMenuProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openWelcome = useTourStore((s) => s.openWelcome);
  const startTour = useTourStore((s) => s.startTour);

  const definition = tourRegistry[tourId];

  // `getTourSections` lee el DOM (los ítems del aside realmente montados) —
  // calcularlo durante el render mezclaría lo que el server ve (nada) con lo
  // que el cliente ve (los ítems ya en el HTML) y rompería la hidratación.
  // Se calcula recién en un efecto, así el primer render (server y cliente)
  // coincide en "todavía no sé qué secciones hay", y el ícono aparece un
  // instante después de montar.
  const [sections, setSections] = useState<ReturnType<typeof getTourSections>>([]);
  useEffect(() => {
    setSections(definition ? getTourSections(definition) : []);
  }, [definition]);

  if (!definition || sections.length === 0) return null;

  const close = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title="Ver guía de esta pantalla" arrow placement="bottom">
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          size="small"
          data-tour="shell.navbar.guide-button"
          sx={{
            width: 34,
            height: 34,
            borderRadius: '8px',
            color: COLOR_TOKENS.brand,
            border: `1px solid ${isDark ? `${COLOR_TOKENS.brand}45` : `${COLOR_TOKENS.brand}35`}`,
            background: isDark ? `${COLOR_TOKENS.brand}14` : `${COLOR_TOKENS.brand}0c`,
            '&:hover': {
              background: isDark ? `${COLOR_TOKENS.brand}22` : `${COLOR_TOKENS.brand}18`,
            },
          }}
        >
          <Compass size={16} strokeWidth={1.75} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 260,
              borderRadius: '12px',
              border: `1px solid ${theme.palette.card.border}`,
              boxShadow: isDark ? '0 24px 60px rgba(0,0,0,.5)' : '0 16px 40px rgba(0,0,0,.16)',
            },
          },
        }}
      >
        <Typography sx={{ px: 2, pt: 1, pb: 0.5, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: COLOR_TOKENS.brand }}>
          Guía de esta pantalla
        </Typography>

        <MenuItem
          onClick={() => { close(); openWelcome(tourId, actions); }}
          sx={{ py: 1, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.15 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Compass size={14} strokeWidth={1.75} color={COLOR_TOKENS.brand} />
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'text.primary' }}>
              Tour completo
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', pl: '20px' }}>
            Recorré toda la pantalla, sección por sección
          </Typography>
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        {sections.map((section) => (
          <MenuItem
            key={section.groupId}
            onClick={() => { close(); startTour(tourId, actions, { startGroupId: section.groupId }); }}
            sx={{ py: 0.9, px: 2 }}
          >
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'text.primary' }}>
              {section.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
