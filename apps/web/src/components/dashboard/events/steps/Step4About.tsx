import { useController, type UseFormReturn } from 'react-hook-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { CreateEventInput } from '@/lib/validations/event';
import { RichTextEditor } from '../RichTextEditor';

interface Props {
  form: UseFormReturn<CreateEventInput>;
}

const sectionSx = {
  p: 4,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  mb: 2,
};

const tips = [
  {
    icon: '⌨️',
    title: 'Párrafos y saltos de línea',
    lines: [
      'Enter → punto y aparte (crea un párrafo nuevo con espacio entre bloques)',
      'Shift + Enter → punto y seguido (salto de línea dentro del mismo bloque, sin espacio extra)',
    ],
  },
  {
    icon: '🔠',
    title: 'Títulos y jerarquía',
    lines: [
      'Usá H1 para el título principal de una sección, H2 para subtítulos, H3 en adelante para detalles.',
      'Los títulos aplican a todo el párrafo donde está el cursor — no hace falta seleccionar el texto.',
    ],
  },
  {
    icon: '✏️',
    title: 'Formato de texto',
    lines: [
      'Negrita, cursiva y subrayado sí aplican solo al texto que tengas seleccionado.',
      'Atajos: Ctrl+B = negrita · Ctrl+I = cursiva · Ctrl+U = subrayado',
    ],
  },
  {
    icon: '📋',
    title: 'Listas y citas',
    lines: [
      'Usá viñetas o numeración para listar actividades, requisitos o pasos.',
      'El botón de cita (") sirve para destacar un texto importante o una frase.',
      'El guión (—) inserta una línea separadora horizontal para dividir secciones.',
    ],
  },
];

export function Step4About({ form }: Props) {
  const { register, control, formState: { errors } } = form;

  const description    = useController({ name: 'description',    control });
  const hostChurch     = useController({ name: 'hostChurch',     control });
  const activities     = useController({ name: 'activities',     control });
  const extraInfo      = useController({ name: 'extraInfo',      control });
  const targetAudience = useController({ name: 'targetAudience', control });

  return (
    <Box sx={sectionSx}>
      <Grid container spacing={3}>

        {/* ── Panel de instrucciones ─────────────────────────────────────── */}
        <Grid item xs={12}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: (t) => `${t.palette.info.main}50`,
              background: (t) => `${t.palette.info.main}0d`,
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} mb={2} color="info.main">
              💡 Cómo usar el editor de texto
            </Typography>
            <Grid container spacing={2}>
              {tips.map((tip) => (
                <Grid item xs={12} sm={6} key={tip.title}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography sx={{ fontSize: '1rem', lineHeight: 1.4, flexShrink: 0 }}>
                      {tip.icon}
                    </Typography>
                    <Box>
                      <Typography variant="caption" fontWeight={700} color="text.primary" display="block" mb={0.5}>
                        {tip.title}
                      </Typography>
                      {tip.lines.map((line) => (
                        <Typography key={line} variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.5 }}>
                          {line}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* ── Campos ────────────────────────────────────────────────────── */}
        <Grid item xs={12}>
          <RichTextEditor
            label="Descripción del evento"
            value={description.field.value}
            onChange={description.field.onChange}
            error={!!description.fieldState.error}
            helperText={description.fieldState.error?.message}
            placeholder="Describí el evento..."
          />
        </Grid>

        <Grid item xs={12}>
          <RichTextEditor
            label="Iglesia anfitriona"
            value={hostChurch.field.value}
            onChange={hostChurch.field.onChange}
            error={!!hostChurch.fieldState.error}
            helperText={hostChurch.fieldState.error?.message}
            placeholder="Información sobre la iglesia organizadora..."
          />
        </Grid>

        <Grid item xs={12}>
          <RichTextEditor
            label="Actividades"
            value={activities.field.value}
            onChange={activities.field.onChange}
            error={!!activities.fieldState.error}
            helperText={activities.fieldState.error?.message}
            placeholder="Actividades programadas para el evento..."
          />
        </Grid>

        <Grid item xs={12}>
          <RichTextEditor
            label="Información extra"
            value={extraInfo.field.value}
            onChange={extraInfo.field.onChange}
            error={!!extraInfo.fieldState.error}
            helperText={extraInfo.fieldState.error?.message}
            placeholder="Cualquier información adicional relevante..."
          />
        </Grid>

        <Grid item xs={12}>
          <RichTextEditor
            label="¿Quiénes pueden asistir?"
            value={targetAudience.field.value}
            onChange={targetAudience.field.onChange}
            error={!!targetAudience.fieldState.error}
            helperText={targetAudience.fieldState.error?.message}
            placeholder="Público al que está dirigido el evento..."
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            {...register('capacity')}
            label="Cantidad de cupos"
            type="number"
            fullWidth
            inputProps={{ min: 1 }}
            error={!!errors.capacity}
            helperText={errors.capacity?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            {...register('registrationLink')}
            label="Link de inscripción (Google Form u otro)"
            fullWidth
            placeholder="https://forms.google.com/..."
            error={!!errors.registrationLink}
            helperText={errors.registrationLink?.message}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
