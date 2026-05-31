import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PublicIcon from '@mui/icons-material/Public';
import GroupsIcon from '@mui/icons-material/Groups';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Jornadas Misioneras — Conectando misiones en toda Latinoamérica',
};

const features = [
  {
    icon: <PublicIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Misión Global',
    description: 'Coordinamos eventos misioneros en toda Latinoamérica, conectando comunidades de fe.',
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Comunidad',
    description: 'Una red de misioneros comprometidos que trabajan juntos por un mismo propósito.',
  },
  {
    icon: <FavoriteIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Servicio',
    description: 'Cada jornada es una oportunidad de servir y transformar vidas a través del amor.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)',
          color: 'white',
          py: { xs: 10, md: 16 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" fontWeight={700} gutterBottom>
            Jornadas Misioneras
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
            Conectando misiones y comunidades en toda Latinoamérica
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/eventos"
              variant="contained"
              size="large"
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Ver Eventos
            </Button>
            <Button
              component={Link}
              href="/sign-up"
              variant="outlined"
              size="large"
              sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Registrarse
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography variant="h3" textAlign="center" fontWeight={700} gutterBottom>
          ¿Por qué participar?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 8 }}>
          Somos una plataforma que facilita la organización y participación en jornadas misioneras
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.100', py: { xs: 8, md: 10 }, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={700} gutterBottom>
            ¿Listo para sumarte?
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Creá tu cuenta y empezá a gestionar o participar en jornadas misioneras.
          </Typography>
          <Button component={Link} href="/sign-up" variant="contained" size="large">
            Comenzar ahora
          </Button>
        </Container>
      </Box>
    </>
  );
}
