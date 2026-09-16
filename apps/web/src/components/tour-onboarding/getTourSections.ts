import type { TourDefinition, TourSection } from './types';

/**
 * Deriva la lista de "secciones" (una por groupId) que el menú de guía puede
 * ofrecer para saltar directo — a partir de `buildSteps()`, así se reusa el
 * mismo filtro de rol/permiso (qué existe en el DOM) que ya decide qué
 * grupos existen, en vez de mantener una lista paralela que se puede
 * desincronizar.
 */
export const getTourSections = (definition: TourDefinition): TourSection[] => {
  const seen = new Set<string>();
  const sections: TourSection[] = [];
  for (const step of definition.buildSteps()) {
    if (seen.has(step.groupId)) continue;
    seen.add(step.groupId);
    sections.push({ groupId: step.groupId, label: definition.groupLabels[step.groupId] ?? step.groupId });
  }
  return sections;
};
