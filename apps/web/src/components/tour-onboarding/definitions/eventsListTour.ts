import { eventsListContent } from '../content/tourContent';
import { buildCrudListGroupLabels, buildCrudListTourDefinition } from './crudListSteps';

export const eventsListTourDefinition = buildCrudListTourDefinition(
  eventsListContent,
  buildCrudListGroupLabels('eventsList', 'Encabezado', 'Tabla de eventos'),
);
