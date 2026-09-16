import { countriesListContent } from '../content/tourContent';
import { buildCrudListGroupLabels, buildCrudListTourDefinition } from './crudListSteps';

export const countriesListTourDefinition = buildCrudListTourDefinition(
  countriesListContent,
  buildCrudListGroupLabels('countries', 'Encabezado', 'Tabla de países'),
);
