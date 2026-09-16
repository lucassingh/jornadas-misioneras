import type { MetadataRoute } from 'next';
import { prisma } from '@jornadas/database';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.jornadasmisioneras.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await prisma.event
    .findMany({ select: { id: true, updatedAt: true } })
    .catch(() => []);

  return [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/events`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/localidades`, changeFrequency: 'weekly', priority: 0.6 },
    ...events.map((e) => ({
      url: `${BASE_URL}/events/${e.id}`,
      lastModified: e.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
