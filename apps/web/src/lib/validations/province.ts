import { z } from 'zod';

const ARGENTINA_REGIONS = ['NOA', 'NEA', 'CUYO', 'CENTRO', 'PAMPEANA', 'METROPOLITANA', 'PATAGONIA'] as const;

export const createProvinceSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  countryId: z.number().int().positive('Debe seleccionar un país'),
  region: z.enum(ARGENTINA_REGIONS).optional().nullable(),
});

export const updateProvinceSchema = createProvinceSchema.partial();

export type CreateProvinceInput = z.infer<typeof createProvinceSchema>;
export type UpdateProvinceInput = z.infer<typeof updateProvinceSchema>;
