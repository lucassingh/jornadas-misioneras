'use client';

import type { ReactNode } from 'react';
import { ProductTourOverlay } from './components/ProductTourOverlay';
import { TourWelcomeDialog } from './components/TourWelcomeDialog';

/**
 * Se monta UNA sola vez, envolviendo el dashboard (ver `DashboardShell.tsx`)
 * — orquesta el overlay (máscara + popover) y el cartel de bienvenida. El
 * estado del tour en sí vive en el store de Zustand (`useTourStore`),
 * accesible desde cualquier componente sin prop drilling.
 */
export function ProductTourProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ProductTourOverlay />
      <TourWelcomeDialog />
    </>
  );
}
