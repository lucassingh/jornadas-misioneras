import type { TourDefinition, TourStep } from '../types';

export interface CrudListContent {
  /** Prefijo único de la pantalla — arma los `data-tour`/groupId como `<pageId>.overview` / `<pageId>.table`. */
  pageId: string;
  overview: { title: string; body: string };
  table: { title: string; body: string };
}

/**
 * Las 5 pantallas de listado simple (eventos, testimonios, países,
 * provincias, localidades) comparten la misma forma: Jumbotron (título +
 * botón "Nuevo X") arriba, una tabla abajo. A diferencia del stepper de
 * eventos, acá el Jumbotron y la tabla están SIEMPRE en el DOM — vacía o
 * con filas, la `TableContainer` existe igual — así que no hace falta
 * `onEnter` ni depender de que haya datos cargados para que el tour
 * funcione.
 */
export const buildCrudListSteps = (content: CrudListContent): TourStep[] => [
  {
    id: `${content.pageId}-overview`,
    groupId: `${content.pageId}.overview`,
    target: `${content.pageId}.jumbotron`,
    title: content.overview.title,
    body: content.overview.body,
    placement: 'bottom',
  },
  {
    id: `${content.pageId}-table`,
    groupId: `${content.pageId}.table`,
    target: `${content.pageId}.table`,
    title: content.table.title,
    body: content.table.body,
  },
];

export const buildCrudListGroupLabels = (pageId: string, overviewLabel: string, tableLabel: string): Record<string, string> => ({
  [`${pageId}.overview`]: overviewLabel,
  [`${pageId}.table`]: tableLabel,
});

export const buildCrudListTourDefinition = (content: CrudListContent, groupLabels: Record<string, string>): TourDefinition => ({
  id: content.pageId,
  buildSteps: () => buildCrudListSteps(content),
  groupLabels,
});
