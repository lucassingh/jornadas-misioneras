import { z } from 'zod';
import type { FieldSpec, LeafFieldSpec } from './types';

// Acepta links absolutos (https://...) o rutas del propio sitio (/hero/img-1.webp).
const LINK_RE = /^(https?:\/\/|\/)/;
const LINK_MESSAGE = 'Tiene que ser un link completo (empieza con https://) o una ruta del sitio (empieza con /)';

const EMPTY_MEDIA_MESSAGE: Record<'image' | 'video' | 'url', string> = {
  image: 'Subí una imagen',
  video: 'Subí un video',
  url: 'Pegá un link',
};

function leafSchema(field: LeafFieldSpec): z.ZodTypeAny {
  switch (field.kind) {
    case 'text':
    case 'textarea': {
      const base = z.string().trim().max(field.maxLength, `Máximo ${field.maxLength} caracteres`);
      return field.optional ? base : base.min(1, 'Este texto no puede quedar vacío');
    }
    case 'image':
    case 'video':
    case 'url': {
      const base = z
        .string()
        .trim()
        .max(2048, 'El link es demasiado largo')
        .refine((v) => v === '' || LINK_RE.test(v), LINK_MESSAGE);
      return field.optional ? base : base.refine((v) => v.length > 0, EMPTY_MEDIA_MESSAGE[field.kind]);
    }
    case 'number': {
      const min = field.min ?? 0;
      const max = field.max ?? 999_999;
      return z.coerce
        .number({ invalid_type_error: 'Ingresá un número' })
        .int('Sin decimales')
        .min(min, `Mínimo ${min}`)
        .max(max, `Máximo ${max.toLocaleString('es-AR')}`);
    }
    case 'email':
      return z.string().trim().email('Ingresá un email válido');
  }
}

/**
 * Construye el schema Zod de una sección a partir de sus `FieldSpec`.
 * Es la ÚNICA fuente de validación: la usan el formulario (zodResolver) y la
 * API (`PUT /api/content/[section]`), así nunca se desincronizan.
 */
export function buildSectionSchema(fields: FieldSpec[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    if (field.kind === 'list') {
      const item: Record<string, z.ZodTypeAny> = {};
      for (const leaf of field.fields) item[leaf.key] = leafSchema(leaf);
      shape[field.key] = z
        .array(z.object(item))
        .length(field.length, `Tiene que haber exactamente ${field.length} elementos`);
    } else {
      shape[field.key] = leafSchema(field);
    }
  }
  return z.object(shape);
}

export type SectionSchema = ReturnType<typeof buildSectionSchema>;
