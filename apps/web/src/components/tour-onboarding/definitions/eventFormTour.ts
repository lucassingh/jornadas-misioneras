import { eventFormContent } from '../content/tourContent';
import type { TourDefinition, TourStep } from '../types';

/**
 * El stepper de 7 pasos solo tiene en el DOM el paso activo (`EventForm.tsx`
 * renderiza `{activeStep === N && <StepN .../>}`) — a diferencia del tour de
 * Home, acá SÍ hace falta mover la pantalla con `onEnter`, porque el target
 * de un paso no existe hasta que el stepper esté posicionado ahí. Por eso
 * cada paso del tour tiene su propio grupo (`eventForm.stepN`): permite
 * saltar directo a "quiero ver Pagos" sin pasar por los anteriores, y cada
 * salto dispara `goToStepN` (registrada por `EventForm.tsx` vía
 * `useTourActions`) antes de buscar el target.
 */
const buildEventFormSteps = (): TourStep[] =>
  eventFormContent.steps.map((content, i) => ({
    id: `event-form-step-${i}`,
    groupId: `eventForm.step${i}`,
    target: `eventForm.step${i}.panel`,
    title: content.title,
    body: content.body,
    onEnter: `goToStep${i}`,
  }));

export const eventFormTourDefinition: TourDefinition = {
  id: 'eventForm',
  buildSteps: buildEventFormSteps,
  groupLabels: eventFormContent.groupLabels,
};
