'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { COLOR_TOKENS } from '@jornadas/ui';
import { TOUR_OVERLAY_Z_INDEX } from '../config';
import { useTourStore } from '../store/useTourStore';
import type { TourStep } from '../types';
import type { TourTargetRect } from '../hooks/useTourTarget';

const MotionBox = motion.create(Box);

interface TourPopoverProps {
  step: TourStep;
  rect: TourTargetRect;
}

/**
 * El tooltip/popover del paso activo: título, cuerpo, progreso dentro del
 * grupo, y las acciones (atrás / saltar sección / siguiente / salir).
 * Posicionado con MUI Popper sobre un anchor virtual (el rect que sigue
 * `useTourTarget`, ya suavizado por `useSmoothedRect` en el overlay).
 */
export function TourPopover({ step, rect }: TourPopoverProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const steps = useTourStore((s) => s.steps);
  const stepIndex = useTourStore((s) => s.stepIndex);
  const goNext = useTourStore((s) => s.goNext);
  const goBack = useTourStore((s) => s.goBack);
  const skipGroup = useTourStore((s) => s.skipGroup);
  const exitTour = useTourStore((s) => s.exitTour);

  const groupSteps = useMemo(() => steps.filter((s) => s.groupId === step.groupId), [steps, step.groupId]);
  const indexInGroup = Math.max(groupSteps.findIndex((s) => s.id === step.id), 0);
  const isFirstOverall = stepIndex === 0;
  const isLastOverall = stepIndex === steps.length - 1;
  const hasNextGroup = useMemo(
    () => steps.some((s, idx) => idx > stepIndex && s.groupId !== step.groupId),
    [steps, stepIndex, step.groupId],
  );

  const virtualAnchor = useMemo(
    () => ({ getBoundingClientRect: () => new DOMRect(rect.left, rect.top, rect.width, rect.height) }),
    [rect.top, rect.left, rect.width, rect.height],
  );

  const bg = isDark ? 'rgba(30,26,28,.96)' : 'rgba(255,255,255,.98)';
  const border = theme.palette.card.border;

  return (
    <Popper
      open
      anchorEl={virtualAnchor}
      placement={step.placement ?? 'bottom-start'}
      style={{ zIndex: TOUR_OVERLAY_Z_INDEX + 2 }}
      modifiers={[
        { name: 'offset', options: { offset: [0, 16] } },
        { name: 'preventOverflow', options: { padding: 16 } },
        { name: 'flip', options: { padding: 16 } },
      ]}
    >
      <MotionBox
        initial={{ opacity: 0, y: 6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-live="polite"
        sx={{
          width: 320,
          maxWidth: 'calc(100vw - 32px)',
          p: 2.25,
          borderRadius: '14px',
          background: bg,
          backdropFilter: 'blur(16px)',
          border: `1px solid ${border}`,
          boxShadow: isDark ? '0 24px 60px rgba(0,0,0,.5)' : '0 16px 40px rgba(0,0,0,.16)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: COLOR_TOKENS.brand }}>
            {indexInGroup + 1} de {groupSteps.length}
          </Typography>
          <Button
            onClick={exitTour}
            size="small"
            sx={{ fontSize: '0.68rem', fontWeight: 600, color: 'text.secondary', textTransform: 'none', minWidth: 0, p: 0, mt: '-2px', '&:hover': { color: 'text.primary', background: 'transparent', textDecoration: 'underline' } }}
          >
            Salir
          </Button>
        </Box>

        {step.title && (
          <Typography sx={{ fontFamily: 'var(--font-archivo-black)', fontWeight: 400, fontSize: '0.95rem', color: 'text.primary', mb: 0.75, lineHeight: 1.25 }}>
            {step.title}
          </Typography>
        )}
        <Typography sx={{ fontSize: '0.83rem', color: 'text.secondary', lineHeight: 1.55 }}>
          {step.body}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, gap: 1 }}>
          <Box>
            {!isFirstOverall && (
              <IconButton
                size="small"
                onClick={goBack}
                aria-label="Volver al paso anterior"
                sx={{ width: 30, height: 30, color: 'text.secondary', border: `1px solid ${border}`, borderRadius: '8px' }}
              >
                <ChevronLeft size={16} strokeWidth={1.75} />
              </IconButton>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            {hasNextGroup && (
              <Button
                onClick={skipGroup}
                size="small"
                sx={{ fontSize: '0.76rem', color: 'text.secondary', textTransform: 'none', fontWeight: 500, minWidth: 0, px: 0.5, '&:hover': { color: 'text.primary', background: 'transparent', textDecoration: 'underline' } }}
              >
                Saltar sección
              </Button>
            )}
            <Button
              onClick={goNext}
              variant="contained"
              size="small"
              sx={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '8px',
                px: 2,
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' },
              }}
            >
              {isLastOverall ? 'Finalizar' : 'Siguiente'}
            </Button>
          </Box>
        </Box>
      </MotionBox>
    </Popper>
  );
}
