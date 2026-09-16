import { locationsListContent } from '../content/tourContent';
import { buildCrudListGroupLabels, buildCrudListTourDefinition } from './crudListSteps';

export const locationsListTourDefinition = buildCrudListTourDefinition(
  locationsListContent,
  buildCrudListGroupLabels('locations', 'Encabezado', 'Tabla de localidades'),
);
