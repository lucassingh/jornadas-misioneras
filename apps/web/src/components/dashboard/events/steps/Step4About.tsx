import { type UseFormReturn } from 'react-hook-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import type { CreateEventInput } from '@/lib/validations/event';

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

export function Step4About({ form }: Props) {
  const { register, formState: { errors } } = form;

  return (
    <Box sx={sectionSx}>
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <TextField
            {...register('description')}
            label="Descripción del evento"
            fullWidth
            multiline
            rows={4}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register('hostChurch')}
            label="Iglesia anfitriona"
            fullWidth
            multiline
            rows={3}
            error={!!errors.hostChurch}
            helperText={errors.hostChurch?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register('activities')}
            label="Actividades"
            fullWidth
            multiline
            rows={3}
            error={!!errors.activities}
            helperText={errors.activities?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register('extraInfo')}
            label="Información extra"
            fullWidth
            multiline
            rows={3}
            error={!!errors.extraInfo}
            helperText={errors.extraInfo?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register('targetAudience')}
            label="¿Quiénes pueden asistir?"
            fullWidth
            multiline
            rows={2}
            error={!!errors.targetAudience}
            helperText={errors.targetAudience?.message}
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
