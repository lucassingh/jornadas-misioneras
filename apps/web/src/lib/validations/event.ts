import { z } from 'zod';

const dateField = z
  .string()
  .min(1, 'La fecha es requerida')
  .refine((v) => !isNaN(Date.parse(v)), { message: 'Fecha inválida' });

const positiveAmount = z.coerce
  .number({ invalid_type_error: 'Ingresá un monto válido' })
  .positive('El monto debe ser mayor a 0');

// ── System 1 — single event payment with two pricing tiers ────────────────────

const systemOnePricingSchema = z
  .object({
    paymentSystem: z.literal('SYSTEM_ONE'),
    registrationEarlyDeadline: dateField,
    registrationEarlyAmount: positiveAmount,
    registrationLateDeadline: dateField,
    registrationLateAmount: positiveAmount,
    eventPaymentDeadline: dateField,
    eventPaymentEarlyAmount: positiveAmount,
    eventPaymentAtEventAmount: positiveAmount,
    totalAmount: z.coerce.number().positive().optional(),
  })
  .refine(
    (d) => new Date(d.registrationEarlyDeadline) < new Date(d.registrationLateDeadline),
    { message: 'La fecha early debe ser anterior a la late', path: ['registrationLateDeadline'] },
  )
  .refine((d) => d.registrationEarlyAmount <= d.registrationLateAmount, {
    message: 'El monto early debe ser menor o igual al late',
    path: ['registrationLateAmount'],
  });

// ── System 2 — installment plan ───────────────────────────────────────────────

const systemTwoPricingSchema = z
  .object({
    paymentSystem: z.literal('SYSTEM_TWO'),
    registrationEarlyDeadline: dateField,
    registrationEarlyAmount: positiveAmount,
    registrationLateDeadline: dateField,
    registrationLateAmount: positiveAmount,
    installment1Deadline: dateField,
    installment1Amount: positiveAmount,
    installment2Amount: positiveAmount,
    totalAmount: z.coerce.number().positive().optional(),
  })
  .refine(
    (d) => new Date(d.registrationEarlyDeadline) < new Date(d.registrationLateDeadline),
    { message: 'La fecha early debe ser anterior a la late', path: ['registrationLateDeadline'] },
  )
  .refine((d) => d.registrationEarlyAmount <= d.registrationLateAmount, {
    message: 'El monto early debe ser menor o igual al late',
    path: ['registrationLateAmount'],
  });

export const pricingSchema = z.union([systemOnePricingSchema, systemTwoPricingSchema]);

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
  pricing: pricingSchema.optional().nullable(),
});

export const createEventSchema = baseEventSchema
  .refine((d) => new Date(d.endDate) >= new Date(d.startDate), {
    message: 'La fecha de inicio no puede ser mayor a la de fin',
    path: ['endDate'],
  })
  .superRefine((d, ctx) => {
    if (!d.pricing) return;
    const start = new Date(d.startDate);
    const { pricing } = d;

    if (new Date(pricing.registrationLateDeadline) > start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El cierre de inscripción debe ser antes del inicio del evento',
        path: ['pricing', 'registrationLateDeadline'],
      });
    }

    if (
      pricing.paymentSystem === 'SYSTEM_ONE' &&
      new Date(pricing.eventPaymentDeadline) >= start
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La fecha de pago anticipado debe ser antes del inicio del evento',
        path: ['pricing', 'eventPaymentDeadline'],
      });
    }

    if (
      pricing.paymentSystem === 'SYSTEM_TWO' &&
      new Date(pricing.installment1Deadline) >= start
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La fecha de cuota 1 debe ser antes del inicio del evento',
        path: ['pricing', 'installment1Deadline'],
      });
    }
  });

export const updateEventSchema = baseEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type PricingInput = z.infer<typeof pricingSchema>;

// ── Pricing mapper ────────────────────────────────────────────────────────────
// Converts validated pricing input to a DB-ready flat object.
// Explicitly nulls out the opposite system's fields on update to prevent stale data.

export function mapPricingToDb(pricing: PricingInput) {
  const base = {
    registrationEarlyDeadline: new Date(pricing.registrationEarlyDeadline),
    registrationEarlyAmount: pricing.registrationEarlyAmount,
    registrationLateDeadline: new Date(pricing.registrationLateDeadline),
    registrationLateAmount: pricing.registrationLateAmount,
    totalAmount: pricing.totalAmount ?? null,
  };

  if (pricing.paymentSystem === 'SYSTEM_ONE') {
    return {
      paymentSystem: 'SYSTEM_ONE' as const,
      ...base,
      eventPaymentDeadline: new Date(pricing.eventPaymentDeadline),
      eventPaymentEarlyAmount: pricing.eventPaymentEarlyAmount,
      eventPaymentAtEventAmount: pricing.eventPaymentAtEventAmount,
      installment1Deadline: null,
      installment1Amount: null,
      installment2Amount: null,
    };
  }

  return {
    paymentSystem: 'SYSTEM_TWO' as const,
    ...base,
    installment1Deadline: new Date(pricing.installment1Deadline),
    installment1Amount: pricing.installment1Amount,
    installment2Amount: pricing.installment2Amount,
    eventPaymentDeadline: null,
    eventPaymentEarlyAmount: null,
    eventPaymentAtEventAmount: null,
  };
}
