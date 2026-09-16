import { provincesListContent } from '../content/tourContent';
import { buildCrudListGroupLabels, buildCrudListTourDefinition } from './crudListSteps';

export const provincesListTourDefinition = buildCrudListTourDefinition(
  provincesListContent,
  buildCrudListGroupLabels('provinces', 'Encabezado', 'Tabla de provincias'),
);
