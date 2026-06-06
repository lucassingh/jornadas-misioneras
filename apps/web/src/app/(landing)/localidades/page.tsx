import type { Metadata } from 'next';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import { MapPin, Building2 } from 'lucide-react';
import { getPublicLocations } from '@/lib/queries/public-locations';

export const metadata: Metadata = {
  title: 'Localidades',
  description: 'Localidades donde se realizan jornadas misioneras en Latinoamérica',
};

export const revalidate = 3600;

export default async function LocalidadesPage() {
  const locations = await getPublicLocations();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Localidades
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 6 }}>
        Lugares donde se realizan jornadas misioneras
      </Typography>

      {locations.length === 0 ? (
        <Box textAlign="center" py={10}>
          <MapPin size={40} style={{ opacity: 0.25, marginBottom: 12 }} />
          <Typography variant="h6" color="text.secondary">
            No hay localidades disponibles por el momento.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {locations.map((loc) => (
            <Grid item xs={12} sm={6} md={4} key={loc.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Chip label={loc.province.country.name} size="small" color="primary" />
                    {loc._count.events > 0 && (
                      <Chip
                        label={`${loc._count.events} evento${loc._count.events !== 1 ? 's' : ''}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {loc.title ?? loc.name}
                  </Typography>

                  {loc.title && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      {loc.name}
                    </Typography>
                  )}

                  {loc.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {loc.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 'auto' }}>
                    <Building2 size={14} style={{ opacity: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {loc.province.name}
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
