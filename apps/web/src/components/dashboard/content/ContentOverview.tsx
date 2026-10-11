import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import { ExternalLink, Pencil, LayoutTemplate } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { COLOR_TOKENS } from '@jornadas/ui';
import { Jumbotron } from '../Jumbotron';
import { SECTIONS, SECTION_ORDER, SECTION_AREA_LABELS, type SectionArea } from '@/lib/content';

const AREA_ORDER: SectionArea[] = ['landing', 'event', 'global'];

interface Props {
  /** key de sección → ISO de la última edición (solo las que tienen fila en la DB). */
  customized: Record<string, string>;
}

export function ContentOverview({ customized }: Props) {
  const total = SECTION_ORDER.length;
  const edited = SECTION_ORDER.filter((k) => customized[k]).length;

  return (
    <>
      <Jumbotron
        title="Contenido del sitio"
        subtitle="Editá los textos, fotos y el video de la landing sin tocar código"
        dataTour="content.jumbotron"
        action={
          <Button
            component="a"
            href="/"
            target="_blank"
            rel="noopener"
            variant="outlined"
            endIcon={<ExternalLink size={14} />}
            sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.45)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' } }}
          >
            Ver el sitio
          </Button>
        }
      />

      <Box sx={{ px: 3, pb: 6 }}>
        <Alert severity="info" icon={<LayoutTemplate size={18} />} sx={{ mb: 3 }}>
          Cada tarjeta es una parte del sitio, en el mismo orden en que aparece al hacer scroll. Entrá, cambiá lo que
          necesites y guardá: el sitio se actualiza al instante.{' '}
          <strong>{edited} de {total}</strong> secciones tienen cambios propios; el resto usa los textos originales.
        </Alert>

        <Box data-tour="content.list">
          {AREA_ORDER.map((area) => {
            const keys = SECTION_ORDER.filter((k) => SECTIONS[k].area === area);
            return (
              <Box key={area} sx={{ mb: 4 }}>
                <Typography variant="overline" fontWeight={700} color="text.secondary" display="block" mb={1.5}>
                  {SECTION_AREA_LABELS[area]}
                </Typography>
                <Grid container spacing={2}>
                  {keys.map((key) => {
                    const def = SECTIONS[key];
                    const idx = SECTION_ORDER.indexOf(key);
                    const updatedAt = customized[key];
                    return (
                      <Grid item xs={12} md={6} lg={4} key={key}>
                        <Card sx={{ height: '100%' }}>
                          <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', gap: 1 }}>
                            <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                              <Box
                                sx={{
                                  fontFamily: 'var(--font-archivo-black)',
                                  fontSize: '1.7rem',
                                  lineHeight: 1,
                                  color: COLOR_TOKENS.brand,
                                  opacity: 0.35,
                                }}
                              >
                                {String(idx + 1).padStart(2, '0')}
                              </Box>
                              <Chip
                                size="small"
                                label={updatedAt ? 'Con cambios propios' : 'Texto original'}
                                color={updatedAt ? 'primary' : 'default'}
                                variant={updatedAt ? 'filled' : 'outlined'}
                              />
                            </Box>

                            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.25}>
                              {def.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                              {def.description}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              {updatedAt
                                ? `Última edición: ${format(new Date(updatedAt), "d MMM yyyy, HH:mm", { locale: es })}`
                                : 'Nunca se editó'}
                            </Typography>

                            <Box display="flex" gap={1} mt={0.5} flexWrap="wrap">
                              <Button
                                component={Link}
                                href={`/dashboard/content/${key}`}
                                variant="contained"
                                size="small"
                                startIcon={<Pencil size={14} />}
                              >
                                Editar
                              </Button>
                              <Button
                                component="a"
                                href={def.siteUrl}
                                target="_blank"
                                rel="noopener"
                                size="small"
                                endIcon={<ExternalLink size={13} />}
                              >
                                Ver en el sitio
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
}
