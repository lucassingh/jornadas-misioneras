import { prisma } from '@jornadas/database';

export async function getPublicEvents() {
  return prisma.event.findMany({
    where: { endDate: { gte: new Date() } },
    select: {
      id: true,
      title: true,
      description: true,
      startDate: true,
      endDate: true,
      pricing: {
        select: {
          registrationEarlyAmount: true,
          registrationLateAmount: true,
        },
      },
      country:  { select: { id: true, name: true } },
      province: { select: { id: true, name: true } },
      location: { select: { id: true, name: true } },
    },
    orderBy: { startDate: 'asc' },
  });
}

export type PublicEvent = Awaited<ReturnType<typeof getPublicEvents>>[number];
