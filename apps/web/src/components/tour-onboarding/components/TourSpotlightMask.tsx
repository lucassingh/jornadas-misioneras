'use client';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { COLOR_TOKENS } from '@jornadas/ui';
import { TOUR_OVERLAY_Z_INDEX } from '../config';
import type { TourTargetRect } from '../hooks/useTourTarget';

const PADDING = 8;
const RADIUS = 12;
/** Piso de tamaño del agujero — targets muy chicos (un ícono) quedan con un poco más de aire en vez de un recorte ajustadísimo. */
const MIN_HOLE_SIZE = 56;
const MASK_ID = 'jm-tour-spotlight-mask';

const pad = (rect: TourTargetRect) => {
  const padTop = Math.max((MIN_HOLE_SIZE - rect.height) / 2, PADDING);
  const padLeft = Math.max((MIN_HOLE_SIZE - rect.width) / 2, PADDING);
  return {
    top: Math.max(rect.top - padTop, 0),
    left: Math.max(rect.left - padLeft, 0),
    width: rect.width + padLeft * 2,
    height: rect.height + padTop * 2,
  };
};

/**
 * "Spotlight" real: una única superficie con blur + scrim, con un agujero
 * recortado vía máscara SVG (más un anillo de foco alrededor). Una sola
 * superficie con un agujero recortado (en vez de 4 franjas independientes)
 * evita la costura/brillo raro que aparece en las esquinas con agujeros
 * chicos cuando cada franja blurea por su cuenta.
 *
 * `holeRect` y `ringRect` difieren cuando el step tiene `clearWith`: el
 * agujero de blur cubre una zona más grande, pero el anillo de foco se
 * queda ajustado al ítem puntual. Sin `clearWith`, son el mismo rect.
 */
export function TourSpotlightMask({ holeRect, ringRect }: { holeRect: TourTargetRect | null; ringRect: TourTargetRect | null }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const scrim = isDark ? 'rgba(10,10,14,.45)' : 'rgba(244,244,246,.4)';
  const blur = isDark ? '2px' : '2.5px';

  const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;

  const hole = holeRect ? pad(holeRect) : null;
  const ring = ringRect ? pad(ringRect) : null;

  return (
    <>
      {hole && (
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
          <defs>
            <mask id={MASK_ID} maskUnits="userSpaceOnUse" x={0} y={0} width={vw} height={vh}>
              <rect x={0} y={0} width={vw} height={vh} fill="white" />
              <rect x={hole.left} y={hole.top} width={hole.width} height={hole.height} rx={RADIUS} fill="black" />
            </mask>
          </defs>
        </svg>
      )}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: TOUR_OVERLAY_Z_INDEX,
          background: scrim,
          backdropFilter: `blur(${blur})`,
          WebkitBackdropFilter: `blur(${blur})`,
          mask: hole ? `url(#${MASK_ID})` : undefined,
          WebkitMask: hole ? `url(#${MASK_ID})` : undefined,
        }}
      />
      {ring && (
        <Box
          sx={{
            position: 'fixed',
            zIndex: TOUR_OVERLAY_Z_INDEX + 1,
            top: `${ring.top}px`,
            left: `${ring.left}px`,
            width: `${ring.width}px`,
            height: `${ring.height}px`,
            borderRadius: `${RADIUS}px`,
            border: `2px solid ${COLOR_TOKENS.brand}`,
            boxShadow: `0 0 0 2px ${COLOR_TOKENS.brand}25, 0 0 16px ${COLOR_TOKENS.brand}35`,
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
}
