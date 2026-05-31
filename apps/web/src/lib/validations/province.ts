import { z } from 'zod';

export const createProvinceSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  countryId: z.number().int().positive('Debe seleccionar un país'),
});

export const updateProvinceSchema = createProvinceSchema.partial();

export type CreateProvinceInput = z.infer<typeof createProvinceSchema>;
export type UpdateProvinceInput = z.infer<typeof updateProvinceSchema>;
