import { testimonialsListContent } from '../content/tourContent';
import { buildCrudListGroupLabels, buildCrudListTourDefinition } from './crudListSteps';

export const testimonialsListTourDefinition = buildCrudListTourDefinition(
  testimonialsListContent,
  buildCrudListGroupLabels('testimonials', 'Encabezado', 'Tabla de testimonios'),
);
