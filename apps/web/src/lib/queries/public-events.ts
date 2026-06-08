import { prisma } from '@jornadas/database';

const EVENT_SELECT = {
  id: true,
  title: true,
  imageUrl:  true,
  imageUrl2: true,
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
} as const;

export async function getPublicEvents() {
  return prisma.event.findMany({
    where: { endDate: { gte: new Date() } },
    select: EVENT_SELECT,
    orderBy: { startDate: 'asc' },
  });
}

export type PublicEvent = Awaited<ReturnType<typeof getPublicEvents>>[number];

export async function getPublicEventById(id: number) {
  return prisma.event.findUnique({
    where: { id },
    select: {
      ...EVENT_SELECT,
      hostChurch:       true,
      activities:       true,
      extraInfo:        true,
      targetAudience:   true,
      capacity:         true,
      registrationLink: true,
      contactName:      true,
      contactEmail:     true,
      contactPhone:     true,
    },
  });
}
