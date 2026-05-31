import { z } from 'zod';

const baseEventSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(200),
  description: z.string().max(2000).optional(),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().min(1, 'La fecha de fin es requerida'),
  countryId: z.coerce.number().int().positive('Seleccioná un país'),
  provinceId: z.coerce.number().int().positive('Seleccioná una provincia'),
  locationId: z.coerce.number().int().positive('Seleccioná una localidad'),
});

export const createEventSchema = baseEventSchema.refine(
  (data) => new Date(data.endDate) >= new Date(data.startDate),
  {
    message: 'La fecha de fin debe ser posterior a la fecha de inicio',
    path: ['endDate'],
  },
);

export const updateEventSchema = baseEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
