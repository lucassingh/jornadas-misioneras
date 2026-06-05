import { type UseFormReturn } from 'react-hook-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { User, Mail, Phone } from 'lucide-react';
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

export function Step5Contact({ form }: Props) {
  const { register, formState: { errors } } = form;

  return (
    <Box sx={sectionSx}>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Datos del organizador para que los asistentes puedan comunicarse.
      </Typography>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register('contactName')}
            label="Nombre del contacto"
            fullWidth
            error={!!errors.contactName}
            helperText={errors.contactName?.message}
            InputProps={{ startAdornment: <User size={16} style={{ marginRight: 8, opacity: 0.5 }} /> }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            {...register('contactEmail')}
            label="Email de contacto"
            type="email"
            fullWidth
            error={!!errors.contactEmail}
            helperText={errors.contactEmail?.message}
            InputProps={{ startAdornment: <Mail size={16} style={{ marginRight: 8, opacity: 0.5 }} /> }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            {...register('contactPhone')}
            label="Teléfono WhatsApp"
            fullWidth
            placeholder="+5491112345678"
            error={!!errors.contactPhone}
            helperText={errors.contactPhone?.message ?? 'Con código de país, sin espacios'}
            InputProps={{ startAdornment: <Phone size={16} style={{ marginRight: 8, opacity: 0.5 }} /> }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
