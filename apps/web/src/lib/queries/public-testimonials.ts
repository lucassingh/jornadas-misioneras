import { prisma } from '@jornadas/database';

export type PublicTestimonial = {
  id:        number;
  firstName: string;
  lastName:  string;
  avatarUrl: string | null;
  content:   string;
  eventName: string;
};

export async function getPublicTestimonials(): Promise<PublicTestimonial[]> {
  try {
    return await prisma.testimonial.findMany({
      select: {
        id:        true,
        firstName: true,
        lastName:  true,
        avatarUrl: true,
        content:   true,
        eventName: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  } catch {
    return [];
  }
}
