import { buildSectionSchema, type SectionSchema } from './schema';
import { SECTIONS, SECTION_ORDER, type SiteContent } from './sections';
import type { SectionDefinition, SectionKey } from './types';

export * from './types';
export * from './sections';
export { buildSectionSchema } from './schema';

const schemaCache = new Map<SectionKey, SectionSchema>();

export function getSectionSchema(key: SectionKey): SectionSchema {
  let schema = schemaCache.get(key);
  if (!schema) {
    schema = buildSectionSchema(SECTIONS[key].fields);
    schemaCache.set(key, schema);
  }
  return schema;
}

export function isSectionKey(value: string): value is SectionKey {
  return (SECTION_ORDER as string[]).includes(value);
}

export function getSectionDefinition(key: SectionKey): SectionDefinition<SiteContent[SectionKey]> {
  return SECTIONS[key] as SectionDefinition<SiteContent[SectionKey]>;
}

/**
 * Mezcla lo guardado en la DB con los defaults del código y lo valida.
 * Si la fila está corrupta o le faltan campos nuevos (p. ej. se agregó un
 * campo a la sección después de que el admin la guardó), el resultado sigue
 * siendo válido: los campos faltantes toman el default y, si aun así no
 * valida, se usan los defaults completos. La landing nunca se rompe por
 * contenido.
 */
export function mergeSectionContent<K extends SectionKey>(key: K, raw: unknown): SiteContent[K] {
  const def = SECTIONS[key];
  const candidate =
    raw && typeof raw === 'object' && !Array.isArray(raw)
      ? { ...def.defaults, ...(raw as Record<string, unknown>) }
      : def.defaults;
  const parsed = getSectionSchema(key).safeParse(candidate);
  return (parsed.success ? parsed.data : def.defaults) as SiteContent[K];
}

/** Arma el contenido completo del sitio a partir de las filas de `SiteContent`. */
export function buildSiteContent(rows: { key: string; data: unknown }[]): SiteContent {
  const byKey = new Map(rows.map((r) => [r.key, r.data]));
  const content = {} as SiteContent;
  for (const key of SECTION_ORDER) {
    (content as Record<SectionKey, unknown>)[key] = mergeSectionContent(key, byKey.get(key));
  }
  return content;
}

export const DEFAULT_SITE_CONTENT: SiteContent = buildSiteContent([]);
