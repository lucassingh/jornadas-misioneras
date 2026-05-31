import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { prisma } from '@jornadas/database';
import { EventForm } from '@/components/dashboard/events/EventForm';

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
    prisma.event.findUnique({ where: { id: eventId } }),
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
    <Container maxWidth="md">
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <IconButton component={Link} href="/dashboard/events">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight={700}>
          Editar Evento
        </Typography>
      </Box>

      <EventForm
        event={event}
        countries={countries}
        provinces={provinces}
        locations={locations}
      />
    </Container>
  );
}
