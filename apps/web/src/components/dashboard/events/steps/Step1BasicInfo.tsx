import { Controller, type UseFormReturn } from 'react-hook-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import type { CreateEventInput } from '@/lib/validations/event';
import { CloudinaryUpload } from '../CloudinaryUpload';

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

export function Step1BasicInfo({ form }: Props) {
  const { register, control, formState: { errors } } = form;

  return (
    <Box sx={sectionSx}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            {...register('title')}
            label="Título del evento"
            fullWidth
            required
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <CloudinaryUpload
                value={field.value}
                onChange={field.onChange}
                label="Imagen principal"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="imageUrl2"
            control={control}
            render={({ field }) => (
              <CloudinaryUpload
                value={field.value}
                onChange={field.onChange}
                label="Imagen secundaria (opcional)"
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
