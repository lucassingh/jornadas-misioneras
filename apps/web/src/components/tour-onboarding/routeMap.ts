/**
 * pathname del dashboard → tourId registrado para esa pantalla.
 * `DashboardHeader` (montado una sola vez para todas las páginas del
 * dashboard) lo usa para saber qué tour ofrecer sin que cada `page.tsx`
 * tenga que pasarle nada — un pathname nuevo sin entrada acá simplemente no
 * muestra el ícono de guía todavía.
 */
const EXACT_ROUTE_TOUR_MAP: Record<string, string> = {
  '/dashboard': 'dashboardHome',
  '/dashboard/events': 'eventsList',
  '/dashboard/events/new': 'eventForm',
  '/dashboard/testimonials': 'testimonials',
  '/dashboard/countries': 'countries',
  '/dashboard/provinces': 'provinces',
  '/dashboard/locations': 'locations',
};

/** Rutas dinámicas (con un id en el medio) que no se pueden mapear con un string exacto. */
const PATTERN_ROUTE_TOUR_MAP: { test: (pathname: string) => boolean; tourId: string }[] = [
  // /dashboard/events/123/edit — mismo EventForm, mismo tour que /new.
  { test: (p) => /^\/dashboard\/events\/[^/]+\/edit$/.test(p), tourId: 'eventForm' },
];

export const getTourIdForPathname = (pathname: string): string | undefined =>
  EXACT_ROUTE_TOUR_MAP[pathname] ?? PATTERN_ROUTE_TOUR_MAP.find((r) => r.test(pathname))?.tourId;
