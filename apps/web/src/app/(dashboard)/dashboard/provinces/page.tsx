import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@jornadas/database';
import { ProvincesManager } from '@/components/dashboard/provinces/ProvincesManager';

export const metadata: Metadata = { title: 'Provincias' };

const VALID_PAGE_SIZES = [5, 10, 15, 20];
const DEFAULT_PAGE_SIZE = 10;

export default async function ProvincesPage({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } });
  if (dbUser?.role !== 'ADMIN') redirect('/dashboard');

  const rawSize = parseInt(searchParams.pageSize ?? String(DEFAULT_PAGE_SIZE), 10);
  const pageSize = VALID_PAGE_SIZES.includes(rawSize) ? rawSize : DEFAULT_PAGE_SIZE;
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const skip = (page - 1) * pageSize;

  const [provinces, total, countries] = await Promise.all([
    prisma.province.findMany({
      include: { country: true, _count: { select: { locations: true, events: true } } },
      orderBy: [{ country: { name: 'asc' } }, { name: 'asc' }],
      skip,
      take: pageSize,
    }),
    prisma.province.count(),
    prisma.country.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <ProvincesManager
      provinces={provinces}
      countries={countries}
      page={page}
      totalPages={Math.ceil(total / pageSize)}
      total={total}
      pageSize={pageSize}
    />
  );
}
