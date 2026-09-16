'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTourTarget, type TourTargetRect } from '../hooks/useTourTarget';
import { useSmoothedRect } from '../hooks/useSmoothedRect';
import { useTourStore } from '../store/useTourStore';
import { TourSpotlightMask } from './TourSpotlightMask';
import { TourPopover } from './TourPopover';
import type { TourStep } from '../types';

interface DisplayedStep {
  step: TourStep;
  rect: TourTargetRect;
  clearRect: TourTargetRect;
}

/**
 * Único punto de montaje del tour — se porta al `document.body` para escapar
 * del stacking context del AppBar/Drawer del dashboard. Lee el paso activo
 * del store y le pide a `useTourTarget` que lo resuelva; si el target no
 * aparece a tiempo, `goNext()` lo saltea solo.
 *
 * El popover no cambia de texto hasta que el rect del NUEVO paso está
 * resuelto (`resolvedFor` coincide) — así nunca se ve el título de un paso
 * apuntando todavía a la posición del anterior.
 */
export function ProductTourOverlay() {
  const activeTourId = useTourStore((s) => s.activeTourId);
  const steps = useTourStore((s) => s.steps);
  const stepIndex = useTourStore((s) => s.stepIndex);
  const goNext = useTourStore((s) => s.goNext);
  const exitTour = useTourStore((s) => s.exitTour);

  const currentStep = activeTourId ? steps[stepIndex] ?? null : null;
  const { rect: liveRect, clearRect: liveClearRect, resolvedFor } = useTourTarget(
    currentStep?.target ?? null,
    currentStep?.unionWith,
    currentStep?.clearWith,
    goNext,
  );

  const [displayed, setDisplayed] = useState<DisplayedStep | null>(null);
  useEffect(() => {
    if (currentStep && liveRect && liveClearRect && resolvedFor === currentStep.target) {
      setDisplayed({ step: currentStep, rect: liveRect, clearRect: liveClearRect });
    }
  }, [currentStep, liveRect, liveClearRect, resolvedFor]);

  const smoothedRect = useSmoothedRect(displayed?.rect ?? null);
  const smoothedClearRect = useSmoothedRect(displayed?.clearRect ?? null);

  useEffect(() => {
    if (!activeTourId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') exitTour();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeTourId, exitTour]);

  if (!activeTourId || !displayed) return null;

  return createPortal(
    <>
      <TourSpotlightMask ringRect={smoothedRect} holeRect={smoothedClearRect ?? smoothedRect} />
      {smoothedRect && <TourPopover step={displayed.step} rect={smoothedRect} />}
    </>,
    document.body,
  );
}
