import type { Metadata } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { prisma } from '@jornadas/database';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const metadata: Metadata = {
  title: 'Eventos',
  description: 'Próximas jornadas misioneras en Latinoamérica',
};

export const revalidate = 3600;

async function getPublicEvents() {
  try {
    return await prisma.event.findMany({
      where: { endDate: { gte: new Date() } },
      include: {
        country: true,
        province: true,
        location: true,
      },
      orderBy: { startDate: 'asc' },
    });
  } catch {
    return [];
  }
}

export default async function EventosPage() {
  const events = await getPublicEvents();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Próximas Jornadas
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 6 }}>
        Encontrá una jornada misionera cerca tuyo
      </Typography>

      {events.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Typography variant="h6" color="text.secondary">
            No hay eventos próximos por el momento.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Chip
                    label={event.country.name}
                    size="small"
                    color="primary"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {event.title}
                  </Typography>
                  {event.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {event.description}
                    </Typography>
                  )}
                  <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                    <CalendarMonthIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {format(event.startDate, "d 'de' MMMM, yyyy", { locale: es })}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {event.location.name}, {event.province.name}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
