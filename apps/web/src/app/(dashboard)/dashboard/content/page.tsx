export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@jornadas/database';
import { ContentOverview } from '@/components/dashboard/content/ContentOverview';

export const metadata: Metadata = { title: 'Contenido del sitio' };

export default async function ContentPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } });
  if (dbUser?.role !== 'ADMIN') redirect('/dashboard');

  // Si la tabla todavía no existe (migración pendiente) la pantalla igual
  // abre: todas las secciones aparecen como "texto original".
  const rows = await prisma.siteContent
    .findMany({ select: { key: true, updatedAt: true } })
    .catch(() => [] as { key: string; updatedAt: Date }[]);

  const customized = Object.fromEntries(rows.map((r) => [r.key, r.updatedAt.toISOString()]));

  return <ContentOverview customized={customized} />;
}
