import { type UseFormReturn } from 'react-hook-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { differenceInDays, parseISO, isValid } from 'date-fns';
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

export function Step2Dates({ form }: Props) {
  const { register, watch, formState: { errors } } = form;

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const duration = (() => {
    if (!startDate || !endDate) return null;
    const s = parseISO(startDate);
    const e = parseISO(endDate);
    if (!isValid(s) || !isValid(e)) return null;
    const days = differenceInDays(e, s);
    return days >= 0 ? days : null;
  })();

  return (
    <Box sx={sectionSx}>
      <Grid container spacing={2.5} alignItems="flex-start">
        <Grid item xs={12} sm={5}>
          <TextField
            {...register('startDate')}
            label="Fecha de inicio"
            type="date"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.startDate}
            helperText={errors.startDate?.message}
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <TextField
            {...register('endDate')}
            label="Fecha de fin"
            type="date"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.endDate}
            helperText={errors.endDate?.message}
          />
        </Grid>

        <Grid item xs={12} sm={2} display="flex" alignItems="center" pt={{ xs: 0, sm: 1 }}>
          {duration !== null && (
            <Chip
              label={duration === 0 ? '1 día' : `${duration + 1} días`}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
