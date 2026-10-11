/**
 * Contenido autoadministrable del sitio (CMS liviano).
 *
 * Cada sección de la landing se describe UNA sola vez con una lista de
 * `FieldSpec` (ver `sections.ts`). De esa lista se derivan:
 *   · el schema Zod que valida en la API y en el formulario (`schema.ts`)
 *   · el formulario del dashboard, con sus ayudas y contadores (`FieldRenderer`)
 *   · los límites "amigables" (máx. de caracteres) que protegen el diseño
 */

export type SectionKey =
  | 'hero'
  | 'video'
  | 'about'
  | 'locations'
  | 'events'
  | 'stats'
  | 'testimonials'
  | 'cta'
  | 'footer'
  | 'eventDetail'
  | 'contact'
  | 'seo';

interface BaseFieldSpec {
  key: string;
  /** Nombre del campo tal como lo ve el usuario. */
  label: string;
  /** Explicación en lenguaje simple: dónde se ve y qué límites tiene. */
  help?: string;
}

export interface TextFieldSpec extends BaseFieldSpec {
  kind: 'text';
  maxLength: number;
  optional?: boolean;
  placeholder?: string;
}

export interface TextareaFieldSpec extends BaseFieldSpec {
  kind: 'textarea';
  maxLength: number;
  rows?: number;
  optional?: boolean;
}

export interface ImageFieldSpec extends BaseFieldSpec {
  kind: 'image';
  optional?: boolean;
}

export interface VideoFieldSpec extends BaseFieldSpec {
  kind: 'video';
  optional?: boolean;
}

export interface NumberFieldSpec extends BaseFieldSpec {
  kind: 'number';
  min?: number;
  max?: number;
}

export interface UrlFieldSpec extends BaseFieldSpec {
  kind: 'url';
  optional?: boolean;
}

export interface EmailFieldSpec extends BaseFieldSpec {
  kind: 'email';
}

export type LeafFieldSpec =
  | TextFieldSpec
  | TextareaFieldSpec
  | ImageFieldSpec
  | VideoFieldSpec
  | NumberFieldSpec
  | UrlFieldSpec
  | EmailFieldSpec;

/** Lista de largo fijo (ej. los 4 pilares de "Nosotros", las 3 tarjetas de datos). */
export interface ListFieldSpec extends BaseFieldSpec {
  kind: 'list';
  length: number;
  /** Título de cada ítem, en orden. Si falta, se usa `${label} N`. */
  itemLabels?: string[];
  fields: LeafFieldSpec[];
}

export type FieldSpec = LeafFieldSpec | ListFieldSpec;

export type SectionArea = 'landing' | 'event' | 'global';

export interface SectionDefinition<T> {
  key: SectionKey;
  /** Nombre corto para el menú lateral. */
  navLabel: string;
  /** Título de la pantalla de edición. */
  label: string;
  /** Qué es y dónde se ve, en lenguaje de usuario (sin jerga técnica). */
  description: string;
  /** Link para ver esa parte en el sitio público. */
  siteUrl: string;
  /** Dónde vive: página principal, página de evento o datos generales. */
  area: SectionArea;
  fields: FieldSpec[];
  /** Valores con los que se publicó el sitio — se usan si nunca se editó la sección. */
  defaults: T;
}
