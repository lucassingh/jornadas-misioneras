'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FileText, CalendarRange, MapPinned } from 'lucide-react';
import { createEventSchema, type CreateEventInput } from '@/lib/validations/event';
import { COLOR_TOKENS } from '@jornadas/ui';

interface Country { id: number; name: string }
interface Province { id: number; name: string; countryId: number; country: Country }
interface Location { id: number; name: string; provinceId: number }
interface EventData {
  id: number; title: string; description: string | null;
  startDate: Date; endDate: Date;
  countryId: number; provinceId: number; locationId: number;
}

interface Props {
  event?: EventData;
  countries: Country[];
  provinces: Province[];
  locations: Location[];
}

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 2,
        pb: 1.5,
        borderBottom: `1px solid`,
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 0.75,
          borderRadius: 1.5,
          bgcolor: `${COLOR_TOKENS.extra1}22`,
          color: COLOR_TOKENS.extra1,
        }}
      >
        {icon}
      </Box>
      <Typography variant="overline" fontWeight={700} color="text.secondary" lineHeight={1}>
        {label}
      </Typography>
    </Box>
  );
}

export function EventForm({ event, countries, provinces, locations }: Props) {
  const router = useRouter();
  const isEditing = !!event;

  const { register, handleSubmit, watch, control, formState: { errors, isSubmitting } } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: event
      ? {
          title: event.title,
          description: event.description ?? '',
          startDate: new Date(event.startDate).toISOString().slice(0, 16),
          endDate: new Date(event.endDate).toISOString().slice(0, 16),
          countryId: event.countryId,
          provinceId: event.provinceId,
          locationId: event.locationId,
        }
      : {},
  });

  const selectedCountryId = watch('countryId');
  const selectedProvinceId = watch('provinceId');
  const filteredProvinces = selectedCountryId ? provinces.filter((p) => p.countryId === Number(selectedCountryId)) : provinces;
  const filteredLocations = selectedProvinceId ? locations.filter((l) => l.provinceId === Number(selectedProvinceId)) : locations;

  const onSubmit = async (data: CreateEventInput) => {
    const toastId = toast.loading(isEditing ? 'Actualizando evento...' : 'Creando evento...');
    const res = await fetch(isEditing ? `/api/events/${event.id}` : '/api/events', {
      method: isEditing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        countryId: Number(data.countryId),
        provinceId: Number(data.provinceId),
        locationId: Number(data.locationId),
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      }),
    });

    if (res.ok) {
      toast.success(isEditing ? 'Evento actualizado' : 'Evento creado', { id: toastId });
      router.push('/dashboard/events');
      router.refresh();
    } else {
      const json = await res.json();
      toast.error(json.error?.message ?? 'Error al guardar el evento', { id: toastId });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

      {/* Sección: Información general */}
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <SectionLabel icon={<FileText size={15} />} label="Información general" />
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <TextField
              {...register('title')}
              label="Título del evento"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('description')}
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
              placeholder="Descripción opcional del evento..."
            />
          </Grid>
        </Grid>
      </Box>

      {/* Sección: Fechas */}
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <SectionLabel icon={<CalendarRange size={15} />} label="Fechas" />
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('startDate')}
              label="Fecha de inicio"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('endDate')}
              label="Fecha de fin"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.endDate}
              helperText={errors.endDate?.message}
              required
            />
          </Grid>
        </Grid>
      </Box>

      {/* Sección: Ubicación */}
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <SectionLabel icon={<MapPinned size={15} />} label="Ubicación" />
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={4}>
            <Controller name="countryId" control={control} render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} select label="País" fullWidth error={!!errors.countryId} helperText={errors.countryId?.message} required>
                {countries.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </TextField>
            )} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller name="provinceId" control={control} render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} select label="Provincia" fullWidth error={!!errors.provinceId} helperText={errors.provinceId?.message} required disabled={!selectedCountryId}>
                {filteredProvinces.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
              </TextField>
            )} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller name="locationId" control={control} render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} select label="Localidad" fullWidth error={!!errors.locationId} helperText={errors.locationId?.message} required disabled={!selectedProvinceId}>
                {filteredLocations.map((l) => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>)}
              </TextField>
            )} />
          </Grid>
        </Grid>
      </Box>

      {/* Acciones */}
      <Box display="flex" gap={2} justifyContent="flex-end">
        <Button variant="text" onClick={() => router.back()} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ px: 4 }}>
          {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar Evento' : 'Crear Evento'}
        </Button>
      </Box>
    </Box>
  );
}
