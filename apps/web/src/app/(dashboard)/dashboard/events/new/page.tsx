export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@jornadas/database';
import { EventForm } from '@/components/dashboard/events/EventForm';
import { Jumbotron } from '@/components/dashboard/Jumbotron';

export const metadata: Metadata = { title: 'Nuevo Evento' };

export default async function NewEventPage() {
  const [countries, provinces, locations] = await Promise.all([
    prisma.country.findMany({ orderBy: { name: 'asc' } }),
    prisma.province.findMany({ include: { country: true }, orderBy: { name: 'asc' } }),
    prisma.location.findMany({ include: { province: true }, orderBy: { name: 'asc' } }),
  ]);

  return (
    <>
      <Jumbotron
        title="Nuevo Evento"
        subtitle="Completá los datos para crear un nuevo evento"
        action={
          <IconButton component={Link} href="/dashboard/events" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}>
            <ArrowLeft size={20} />
          </IconButton>
        }
      />
      <Box sx={{ px: { xs: 2, md: 6 }, pb: 6 }}>
        <EventForm countries={countries} provinces={provinces} locations={locations} />
      </Box>
    </>
  );
}
