import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export function LandingFooter() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: 'grey.900', color: 'grey.400', py: 4, mt: 'auto' }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Jornadas Misioneras. Todos los derechos reservados.
          </Typography>
          <Typography variant="body2">
            Conectando misiones en toda Latinoamérica
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
