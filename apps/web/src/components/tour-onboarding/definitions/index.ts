import { dashboardHomeTourDefinition } from './dashboardHomeTour';
import { eventFormTourDefinition } from './eventFormTour';
import { eventsListTourDefinition } from './eventsListTour';
import { testimonialsListTourDefinition } from './testimonialsListTour';
import { countriesListTourDefinition } from './countriesListTour';
import { provincesListTourDefinition } from './provincesListTour';
import { locationsListTourDefinition } from './locationsListTour';
import type { TourDefinition } from '../types';

/** Registro central: un `TourDefinition` por cada `tourId` que el dashboard soporta. */
export const tourRegistry: Record<string, TourDefinition> = {
  dashboardHome: dashboardHomeTourDefinition,
  eventForm: eventFormTourDefinition,
  eventsList: eventsListTourDefinition,
  testimonials: testimonialsListTourDefinition,
  countries: countriesListTourDefinition,
  provinces: provincesListTourDefinition,
  locations: locationsListTourDefinition,
};
