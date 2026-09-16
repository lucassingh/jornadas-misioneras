import { shellContent } from '../content/tourContent';
import type { TourStep } from '../types';

/**
 * Un paso por cada ítem del aside realmente visible ahora mismo — se lee del
 * DOM en vez de reimplementar el filtro por rol que ya hace
 * `DashboardSidebar.tsx` (única fuente de verdad de qué ítems ve cada
 * usuario). Si se agrega un ítem nuevo al aside sin agregar su texto acá,
 * el paso igual se genera con un cuerpo genérico en vez de romperse.
 */
const buildAsideItemSteps = (): TourStep[] => {
  // `buildSteps()` corre durante el render de `TourGuideMenu` (vía
  // `getTourSections`), y ese componente, aunque es client, igual se
  // renderiza una vez en el servidor para el HTML inicial de Next.js — ahí
  // no existe `document`. En esa pasada no hay ítems que resaltar todavía
  // de cualquier forma, así que devolver vacío es correcto, no un parche.
  if (typeof document === 'undefined') return [];

  const nodes = Array.from(document.querySelectorAll('[data-tour^="shell.aside.item."]'));
  return nodes.map((node, idx) => {
    const dataTour = node.getAttribute('data-tour') ?? '';
    const href = dataTour.replace('shell.aside.item.', '');
    return {
      id: `shell-aside-item-${idx}`,
      groupId: 'shell.aside',
      target: dataTour,
      body: shellContent.asideItems[href] ?? shellContent.asideItemGenericBody,
    };
  });
};

/**
 * Pasos del "shell" del dashboard (navbar + aside) — comunes a cualquier
 * tour de cualquier pantalla. Orden: navbar primero (ícono de guía, tema,
 * cuenta), después cada ítem del aside.
 */
export const buildShellSteps = (): TourStep[] => [
  {
    id: 'shell-navbar-guide',
    groupId: 'shell.navbar',
    // Solo existe en el DOM si la pantalla tiene un tour registrado con al menos una sección —
    // si no, el motor lo saltea solo (mismo mecanismo que cualquier otro target ausente).
    target: 'shell.navbar.guide-button',
    title: shellContent.navbar.guideButton.title,
    body: shellContent.navbar.guideButton.body,
    placement: 'bottom',
  },
  {
    id: 'shell-navbar-theme',
    groupId: 'shell.navbar',
    target: 'shell.navbar.theme-toggle',
    title: shellContent.navbar.themeToggle.title,
    body: shellContent.navbar.themeToggle.body,
    placement: 'bottom',
  },
  {
    id: 'shell-navbar-account',
    groupId: 'shell.navbar',
    target: 'shell.navbar.account',
    title: shellContent.navbar.account.title,
    body: shellContent.navbar.account.body,
    placement: 'bottom',
  },
  ...buildAsideItemSteps(),
];
