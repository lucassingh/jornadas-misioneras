import { prisma } from '@jornadas/database';

export interface PublicLocationFilters {
  countryId?: number;
  provinceId?: number;
}

export async function getPublicLocations(filters: PublicLocationFilters = {}) {
  const where = {
    ...(filters.provinceId && { provinceId: filters.provinceId }),
    ...(filters.countryId && { province: { countryId: filters.countryId } }),
  };

  return prisma.location.findMany({
    where,
    select: {
      id: true,
      name: true,
      title: true,
      description: true,
      province: {
        select: {
          id: true,
          name: true,
          region: true,
          country: { select: { id: true, name: true } },
        },
      },
      _count: { select: { events: true } },
    },
    orderBy: [{ province: { country: { name: 'asc' } } }, { province: { name: 'asc' } }, { name: 'asc' }],
  });
}

export type PublicLocation = Awaited<ReturnType<typeof getPublicLocations>>[number];
