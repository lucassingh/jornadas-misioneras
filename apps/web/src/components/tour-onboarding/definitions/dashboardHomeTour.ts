import { dashboardHomeContent } from '../content/tourContent';
import type { TourDefinition, TourStep } from '../types';
import { buildShellSteps } from './shellSteps';

const K = dashboardHomeContent.kpis;
const P = dashboardHomeContent.panels;

/**
 * KPIs y paneles admin-only (`dashboard.kpi.countries`, `.locations`,
 * `dashboard.panels.byCountry`) simplemente no están en el DOM para un
 * usuario no-admin — el motor los saltea solo, sin lógica de rol acá.
 */
const buildDashboardHomeContentSteps = (): TourStep[] => [
  {
    id: 'dashboard-kpi-events',
    groupId: 'dashboard.kpis',
    target: 'dashboard.kpi.events',
    title: K.events.title,
    body: K.events.body,
  },
  {
    id: 'dashboard-kpi-month',
    groupId: 'dashboard.kpis',
    target: 'dashboard.kpi.month',
    title: K.month.title,
    body: K.month.body,
  },
  {
    id: 'dashboard-kpi-countries',
    groupId: 'dashboard.kpis',
    target: 'dashboard.kpi.countries',
    title: K.countries.title,
    body: K.countries.body,
  },
  {
    id: 'dashboard-kpi-locations',
    groupId: 'dashboard.kpis',
    target: 'dashboard.kpi.locations',
    title: K.locations.title,
    body: K.locations.body,
  },
  {
    id: 'dashboard-panel-upcoming',
    groupId: 'dashboard.panels',
    target: 'dashboard.panels.upcoming',
    title: P.upcoming.title,
    body: P.upcoming.body,
  },
  {
    id: 'dashboard-panel-by-country',
    groupId: 'dashboard.panels',
    target: 'dashboard.panels.byCountry',
    title: P.byCountry.title,
    body: P.byCountry.body,
  },
];

export const dashboardHomeTourDefinition: TourDefinition = {
  id: 'dashboardHome',
  buildSteps: () => [...buildShellSteps(), ...buildDashboardHomeContentSteps()],
  groupLabels: dashboardHomeContent.groupLabels,
};
