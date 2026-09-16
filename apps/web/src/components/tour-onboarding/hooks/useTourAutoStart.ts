'use client';

import { useEffect } from 'react';
import { TOUR_AUTOSTART_DELAY_MS } from '../config';
import { tourRegistry } from '../definitions';
import { tourStorage } from '../storage/tourStorage';
import { useTourStore } from '../store/useTourStore';
import type { TourStartActions } from '../types';

/**
 * Auto-abre el cartel de bienvenida de una pantalla la primera vez que el
 * usuario entra — solo si esa pantalla lo tiene registrado con
 * `autoStart: true` y no lo vio/descartó todavía. No hace nada por sí solo:
 * cada pantalla decide si la llama.
 */
export function useTourAutoStart(tourId: string, opts: { actions?: TourStartActions; ready: boolean }) {
  const { actions, ready } = opts;
  const openWelcome = useTourStore((s) => s.openWelcome);
  const dismissWelcomeIfPending = useTourStore((s) => s.dismissWelcomeIfPending);

  useEffect(() => {
    if (!ready || !tourRegistry[tourId]?.autoStart) return;
    if (tourStorage.hasSeenTour(tourId)) return;

    // El delay deja asentar las animaciones de layout iniciales para que el primer spotlight no "salte".
    const timer = window.setTimeout(() => openWelcome(tourId, actions), TOUR_AUTOSTART_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      dismissWelcomeIfPending(tourId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, tourId]);
}
