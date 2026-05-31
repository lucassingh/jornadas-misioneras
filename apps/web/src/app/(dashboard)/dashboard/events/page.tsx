import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import Button from '@mui/material/Button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@jornadas/database';
import { EventsTable } from '@/components/dashboard/events/EventsTable';
import { Jumbotron } from '@/components/dashboard/Jumbotron';
import Box from '@mui/material/Box';

export const metadata: Metadata = { title: 'Eventos' };

const VALID_PAGE_SIZES = [5, 10, 15, 20];
const DEFAULT_PAGE_SIZE = 10;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string };
}) {
  const { userId } = await auth();
  if (!userId) return null;

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } });
  const isAdmin = dbUser?.role === 'ADMIN';

  const rawSize = parseInt(searchParams.pageSize ?? String(DEFAULT_PAGE_SIZE), 10);
  const pageSize = VALID_PAGE_SIZES.includes(rawSize) ? rawSize : DEFAULT_PAGE_SIZE;
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const skip = (page - 1) * pageSize;
  const where = isAdmin ? {} : { createdBy: userId };

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: { country: true, province: true, location: true },
      orderBy: { startDate: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.event.count({ where }),
  ]);

  return (
    <>
      <Jumbotron
        title="Eventos"
        subtitle={isAdmin ? 'Todos los eventos de la plataforma' : 'Tus eventos creados'}
        action={
          <Button component={Link} href="/dashboard/events/new" variant="contained" color="secondary" startIcon={<Plus size={16} />}>
            Nuevo Evento
          </Button>
        }
      />
      <Box sx={{ px: 3, pb: 3 }}>
        <EventsTable
          events={events}
          currentUserId={userId}
          isAdmin={isAdmin}
          page={page}
          totalPages={Math.ceil(total / pageSize)}
          total={total}
          pageSize={pageSize}
        />
      </Box>
    </>
  );
}
