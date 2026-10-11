import { z } from 'zod';

const dateField = z
  .string()
  .min(1, 'La fecha es requerida')
  .refine((v) => !isNaN(Date.parse(v)), { message: 'Fecha inválida' });

const positiveAmount = z.coerce
  .number({ invalid_type_error: 'Ingresá un monto válido' })
  .positive('El monto debe ser mayor a 0');

// ── Pricing ───────────────────────────────────────────────────────────────────
// Una sola modalidad: dos montos según cuándo se paga (ver `lib/pricing.ts`).
// Las fechas límite se derivan de startDate, por eso no forman parte del input.

export const pricingSchema = z
  .object({
    priceTwoMonthsBefore: positiveAmount,
    priceOneMonthBefore: positiveAmount,
  })
  .refine((d) => d.priceTwoMonthsBefore <= d.priceOneMonthBefore, {
    message: 'El monto de "dos meses antes" debe ser menor o igual al de "un mes antes"',
    path: ['priceOneMonthBefore'],
  });

// ── Event ─────────────────────────────────────────────────────────────────────

const baseEventSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(200),
  imageUrl: z.string().optional().nullable(),
  imageUrl2: z.string().optional().nullable(),
  startDate: dateField,
  endDate: dateField,
  countryId: z.coerce.number().int().positive('Seleccioná un país'),
  provinceId: z.coerce.number().int().positive('Seleccioná una provincia'),
  locationId: z.coerce.number().int().positive('Seleccioná una localidad'),
  description: z.string().max(50000).optional().nullable(),
  hostChurch: z.string().max(50000).optional().nullable(),
  activities: z.string().max(50000).optional().nullable(),
  extraInfo: z.string().max(50000).optional().nullable(),
  targetAudience: z.string().max(50000).optional().nullable(),
  capacity: z.coerce.number().int().positive('La capacidad debe ser mayor a 0').optional().nullable(),
  registrationLink: z.string().optional().nullable(),
  // Contact
  contactName: z.string().min(2, 'Mínimo 2 caracteres').max(100).optional().nullable(),
  contactEmail: z.string().email('Email inválido').optional().nullable(),
  contactPhone: z
    .string()
    .regex(/^\+\d{7,15}$/, 'Formato WhatsApp: +5491112345678 (sin espacios)')
    .optional()
    .nullable(),
  // null / undefined = evento gratuito
  pricing: pricingSchema.optional().nullable(),
});

export const createEventSchema = baseEventSchema.refine(
  (d) => new Date(d.endDate) >= new Date(d.startDate),
  {
    message: 'La fecha de inicio no puede ser mayor a la de fin',
    path: ['endDate'],
  },
);

export const updateEventSchema = baseEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type PricingInput = z.infer<typeof pricingSchema>;

// ── Pricing mapper ────────────────────────────────────────────────────────────
// Convierte el input validado al objeto plano que espera Prisma.

export function mapPricingToDb(pricing: PricingInput) {
  return {
    priceTwoMonthsBefore: pricing.priceTwoMonthsBefore,
    priceOneMonthBefore: pricing.priceOneMonthBefore,
  };
}
