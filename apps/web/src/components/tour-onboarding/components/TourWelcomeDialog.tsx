'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Compass, X } from 'lucide-react';
import { COLOR_TOKENS } from '@jornadas/ui';
import { useTourStore } from '../store/useTourStore';

const INSTRUCTIONS = [
  'Podés volver a abrir esta guía cuando quieras desde el ícono de la brújula, en la barra superior.',
  'Desde ese mismo ícono podés saltar directo a la sección que te interese, sin repetir todo el tour.',
  'En cualquier paso podés saltar el resto de la sección actual con "Saltar sección".',
  'Usá los botones de abajo (o las flechas) para ir y volver entre pasos.',
  'Podés cerrar el tour en cualquier momento con "Salir" o la tecla Escape.',
];

const InstructionRow = ({ text }: { text: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.1 }}>
    <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: COLOR_TOKENS.brand, flexShrink: 0, mt: '7px' }} />
    <Typography sx={{ fontSize: '0.83rem', color: 'text.secondary', lineHeight: 1.5 }}>{text}</Typography>
  </Box>
);

/**
 * Cartel de bienvenida/instrucciones, montado una sola vez en
 * `ProductTourProvider`. Sin props — lee `welcomePending` directo del store.
 * Se muestra al elegir "Tour completo" desde el menú de guía — nunca al
 * saltar directo a una sección puntual.
 */
export function TourWelcomeDialog() {
  const welcomePending = useTourStore((s) => s.welcomePending);
  const confirmWelcome = useTourStore((s) => s.confirmWelcome);
  const dismissWelcome = useTourStore((s) => s.dismissWelcome);

  return (
    <Dialog
      open={!!welcomePending}
      onClose={dismissWelcome}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: '14px' } }}
      slotProps={{ backdrop: { sx: { backdropFilter: 'blur(4px)', bgcolor: 'rgba(0,0,0,.55)' } } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.25, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '9px', bgcolor: `${COLOR_TOKENS.brand}15`, border: `1px solid ${COLOR_TOKENS.brand}40`, flexShrink: 0 }}>
          <Compass size={17} strokeWidth={1.75} color={COLOR_TOKENS.brand} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '1.02rem', color: 'text.primary', lineHeight: 1.25, flex: 1 }}>
          Bienvenido al recorrido guiado
        </Typography>
        <IconButton size="small" onClick={dismissWelcome} sx={{ color: 'text.secondary', mt: '-4px' }}>
          <X size={16} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, pt: 0.5 }}>
        <Typography sx={{ fontSize: '0.86rem', color: 'text.secondary', lineHeight: 1.55 }}>
          Te mostramos rápido cómo funciona esta pantalla, sección por sección.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {INSTRUCTIONS.map((text) => (
            <InstructionRow key={text} text={text} />
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0.5, gap: 1 }}>
        <Button
          onClick={dismissWelcome}
          size="small"
          sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary', textTransform: 'none' }}
        >
          Ahora no
        </Button>
        <Button
          onClick={confirmWelcome}
          variant="contained"
          size="small"
          sx={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'none', borderRadius: '8px', px: 2.25, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
        >
          Empezar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
