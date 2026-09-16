import { useEffect, useRef, useState } from 'react';
import type { TourTargetRect } from './useTourTarget';

/** Fracción del camino que recorre cada frame — más alto = más rápido/menos "planeo". */
const SMOOTHING = 0.22;
/** Debajo de este umbral (px) se considera "llegó" y se deja de interpolar, para no vibrar por redondeo. */
const SNAP_EPSILON = 0.3;

/**
 * Suaviza la posición mostrada del spotlight: en vez de saltar
 * instantáneamente a la nueva posición del target, la hace "planear" hacia
 * el valor real con un filtro exponencial simple, cuadro a cuadro — mismo
 * tratamiento sin importar qué tan lejos esté el próximo paso.
 */
export function useSmoothedRect(target: TourTargetRect | null): TourTargetRect | null {
  const [display, setDisplay] = useState<TourTargetRect | null>(target);
  const displayRef = useRef<TourTargetRect | null>(target);
  const targetRef = useRef<TourTargetRect | null>(target);
  targetRef.current = target;

  useEffect(() => {
    let rafId = 0;
    const loop = () => {
      const t = targetRef.current;
      const d = displayRef.current;

      if (t && !d) {
        // Primer valor real: arranca directo en destino, nada de qué planear todavía.
        displayRef.current = t;
        setDisplay(t);
      } else if (t && d) {
        const dTop = t.top - d.top;
        const dLeft = t.left - d.left;
        const dWidth = t.width - d.width;
        const dHeight = t.height - d.height;
        const settled =
          Math.abs(dTop) < SNAP_EPSILON && Math.abs(dLeft) < SNAP_EPSILON &&
          Math.abs(dWidth) < SNAP_EPSILON && Math.abs(dHeight) < SNAP_EPSILON;
        const next = settled ? t : {
          top: d.top + dTop * SMOOTHING,
          left: d.left + dLeft * SMOOTHING,
          width: d.width + dWidth * SMOOTHING,
          height: d.height + dHeight * SMOOTHING,
        };
        displayRef.current = next;
        setDisplay(next);
      } else if (!t && d) {
        displayRef.current = null;
        setDisplay(null);
      }

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return display;
}
