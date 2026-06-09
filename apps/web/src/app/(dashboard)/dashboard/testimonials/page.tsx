import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@jornadas/database';
import { TestimonialsManager } from '@/components/dashboard/testimonials/TestimonialsManager';

export const metadata: Metadata = { title: 'Testimonios' };

const VALID_PAGE_SIZES = [5, 10, 15, 20];
const DEFAULT_PAGE_SIZE = 10;

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } });
  if (dbUser?.role !== 'ADMIN') redirect('/dashboard');

  const rawSize  = parseInt(searchParams.pageSize ?? String(DEFAULT_PAGE_SIZE), 10);
  const pageSize = VALID_PAGE_SIZES.includes(rawSize) ? rawSize : DEFAULT_PAGE_SIZE;
  const page     = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const skip     = (page - 1) * pageSize;

  const [testimonials, total] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' }, skip, take: pageSize }),
    prisma.testimonial.count(),
  ]);

  return (
    <TestimonialsManager
      testimonials={testimonials}
      page={page}
      totalPages={Math.ceil(total / pageSize)}
      total={total}
      pageSize={pageSize}
    />
  );
}
