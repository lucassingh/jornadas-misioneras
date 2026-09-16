'use client';

import { useEffect } from 'react';
import { useTourStore } from '../store/useTourStore';
import type { TourStartActions } from '../types';

/**
 * Publica las acciones que el tour de ESTA pantalla necesita (ej. mover un
 * stepper a un paso puntual con `onEnter`) para que `TourGuideMenu` —
 * montado una sola vez en el header, compartido por todo el dashboard —
 * las use al arrancar este tourId, sin que el header tenga que conocerlas.
 *
 * `actions` tiene que ser estable entre renders (`useMemo`/`useState` con
 * funciones que no cambian) — si es un objeto literal nuevo en cada render,
 * este efecto se re-dispara todo el tiempo sin necesidad.
 */
export function useTourActions(tourId: string, actions: TourStartActions) {
  const registerTourActions = useTourStore((s) => s.registerTourActions);
  const unregisterTourActions = useTourStore((s) => s.unregisterTourActions);

  useEffect(() => {
    registerTourActions(tourId, actions);
    return () => unregisterTourActions(tourId);
  }, [tourId, actions, registerTourActions, unregisterTourActions]);
}
