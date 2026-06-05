export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@jornadas/database';
import { EventForm } from '@/components/dashboard/events/EventForm';
import { Jumbotron } from '@/components/dashboard/Jumbotron';

export const metadata: Metadata = { title: 'Editar Evento' };

interface Props {
  params: { id: string };
}

export default async function EditEventPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const eventId = parseInt(params.id, 10);
  if (isNaN(eventId)) notFound();

  const [event, dbUser] = await Promise.all([
    prisma.event.findUnique({ where: { id: eventId }, include: { pricing: true } }),
    prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } }),
  ]);

  if (!event) notFound();

  const isAdmin = dbUser?.role === 'ADMIN';
  const isOwner = event.createdBy === userId;

  if (!isAdmin && !isOwner) redirect('/dashboard/events');

  const [countries, provinces, locations] = await Promise.all([
    prisma.country.findMany({ orderBy: { name: 'asc' } }),
    prisma.province.findMany({ include: { country: true }, orderBy: { name: 'asc' } }),
    prisma.location.findMany({ include: { province: true }, orderBy: { name: 'asc' } }),
  ]);

  return (
    <>
      <Jumbotron
        title="Editar Evento"
        subtitle="Modificá los datos del evento"
        action={
          <IconButton component={Link} href="/dashboard/events" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}>
            <ArrowLeft size={20} />
          </IconButton>
        }
      />
      <Box sx={{ px: { xs: 2, md: 6 }, pb: 6 }}>
        <EventForm
          event={event as unknown as Parameters<typeof EventForm>[0]['event']}
          countries={countries}
          provinces={provinces}
          locations={locations}
        />
      </Box>
    </>
  );
}
