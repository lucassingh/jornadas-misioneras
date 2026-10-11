import { subMonths, parseISO, isValid } from 'date-fns';

/**
 * Modelo de precios (único, definido por el equipo en 2026-10):
 * un evento con costo tiene DOS montos según cuándo se abona —
 *   · hasta 2 meses antes del inicio → `priceTwoMonthsBefore` (más barato)
 *   · hasta 1 mes antes del inicio   → `priceOneMonthBefore`  (igual o más caro)
 *
 * Las fechas límite no se persisten: se derivan de `Event.startDate` acá, en un
 * solo lugar, para que el wizard, el modal del dashboard y la landing muestren
 * exactamente las mismas fechas.
 */

export interface PricingAmounts {
  priceTwoMonthsBefore: number;
  priceOneMonthBefore: number;
}

export type PricingTierKey = 'twoMonths' | 'oneMonth';

export interface PricingTier {
  key: PricingTierKey;
  /** Etiqueta corta para tarjetas/filas: "Hasta 2 meses antes". */
  label: string;
  /** Descripción de cuándo aplica, para formularios: "Dos meses antes del evento". */
  description: string;
  amount: number;
  deadline: Date;
}

/**
 * Normaliza fechas que vienen de distintas fuentes a un `Date` local sin hora:
 *  - `'2026-12-03'` (input type=date del wizard)        → parseISO, ya es local
 *  - `'2026-12-03T00:00:00.000Z'` (toISOString de @db.Date) → tomamos las partes UTC
 *  - `Date` de Prisma (@db.Date, medianoche UTC)            → ídem
 * Sin esto, en UTC-3 una fecha `@db.Date` se mostraría un día antes.
 */
export function toLocalDate(value: Date | string): Date | null {
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const d = parseISO(value);
      return isValid(d) ? d : null;
    }
    const d = parseISO(value);
    if (!isValid(d)) return null;
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }
  if (!isValid(value)) return null;
  return new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
}

/** Fechas límite derivadas del inicio del evento. `null` si la fecha no es válida todavía. */
export function getPricingDeadlines(startDate: Date | string | null | undefined) {
  if (!startDate) return null;
  const start = toLocalDate(startDate);
  if (!start) return null;
  return {
    twoMonthsBefore: subMonths(start, 2),
    oneMonthBefore: subMonths(start, 1),
  };
}

export const PRICING_TIER_COPY: Record<PricingTierKey, { label: string; description: string }> = {
  twoMonths: { label: 'Hasta 2 meses antes', description: 'Dos meses antes del evento' },
  oneMonth:  { label: 'Hasta 1 mes antes',   description: 'Un mes antes del evento' },
};

/** Los dos tramos de precio, listos para renderizar, en orden cronológico. */
export function getPricingTiers(
  startDate: Date | string,
  pricing: PricingAmounts,
): PricingTier[] | null {
  const deadlines = getPricingDeadlines(startDate);
  if (!deadlines) return null;
  return [
    { key: 'twoMonths', ...PRICING_TIER_COPY.twoMonths, amount: pricing.priceTwoMonthsBefore, deadline: deadlines.twoMonthsBefore },
    { key: 'oneMonth',  ...PRICING_TIER_COPY.oneMonth,  amount: pricing.priceOneMonthBefore,  deadline: deadlines.oneMonthBefore },
  ];
}

/** Precio único: el equipo carga el mismo valor en las dos filas. */
export function isSinglePrice(pricing: PricingAmounts): boolean {
  return pricing.priceTwoMonthsBefore === pricing.priceOneMonthBefore;
}

/** `$150.000` — formato de la landing (sin espacio ni decimales). */
export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
}
