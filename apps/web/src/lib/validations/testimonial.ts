import { z } from 'zod';

export const createTestimonialSchema = z.object({
  firstName: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  lastName:  z.string().min(2, 'Mínimo 2 caracteres').max(100),
  avatarUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  content:   z.string().min(10, 'El testimonio debe tener al menos 10 caracteres').max(2000),
  eventName: z.string().min(2, 'Mínimo 2 caracteres').max(200),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
