import { useState } from 'react';
import { type UseFormReturn, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import type { CreateEventInput } from '@/lib/validations/event';
import type { Country, Province, Location } from '../EventForm';

interface Props {
  form: UseFormReturn<CreateEventInput>;
  countries: Country[];
  provinces: Province[];
  locations: Location[];
}

const ARGENTINA_REGIONS = [
  { value: 'NOA', label: 'Noroeste (NOA)' },
  { value: 'NEA', label: 'Noreste (NEA)' },
  { value: 'CUYO', label: 'Cuyo' },
  { value: 'CENTRO', label: 'Centro' },
  { value: 'PAMPEANA', label: 'Pampeana' },
  { value: 'METROPOLITANA', label: 'Metropolitana (AMBA)' },
  { value: 'PATAGONIA', label: 'Patagonia' },
];

const sectionSx = {
  p: 4,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  mb: 2,
};

export function Step3Location({ form, countries, provinces, locations }: Props) {
  const { control, watch, setValue, formState: { errors } } = form;

  const selectedCountryId = watch('countryId');
  const selectedProvinceId = watch('provinceId');

  const argentinaId = countries.find((c) => c.name === 'Argentina')?.id;
  const isArgentina = selectedCountryId === argentinaId;

  // Derive initial region from already-selected province (for edit mode)
  const [selectedRegion, setSelectedRegion] = useState<string>(() => {
    const province = provinces.find((p) => p.id === selectedProvinceId);
    return province?.region ?? '';
  });

  const handleCountryChange = (countryId: number) => {
    setValue('countryId', countryId);
    setSelectedRegion('');
    setValue('provinceId', undefined as unknown as number);
    setValue('locationId', undefined as unknown as number);
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setValue('provinceId', undefined as unknown as number);
    setValue('locationId', undefined as unknown as number);
  };

  const handleProvinceChange = (provinceId: number) => {
    setValue('provinceId', provinceId);
    setValue('locationId', undefined as unknown as number);
  };

  const filteredProvinces = provinces.filter((p) => {
    if (p.countryId !== Number(selectedCountryId)) return false;
    if (isArgentina && selectedRegion) return p.region === selectedRegion;
    return true;
  });

  const filteredLocations = locations.filter(
    (l) => l.provinceId === Number(selectedProvinceId),
  );

  return (
    <Box sx={sectionSx}>
      <Grid container spacing={2.5}>
        {/* País */}
        <Grid item xs={12} sm={isArgentina ? 3 : 6}>
          <Controller
            name="countryId"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="País"
                fullWidth
                required
                value={field.value ?? ''}
                onChange={(e) => handleCountryChange(Number(e.target.value))}
                error={!!errors.countryId}
                helperText={errors.countryId?.message}
              >
                {countries.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Región (solo Argentina) */}
        {isArgentina && (
          <Grid item xs={12} sm={3}>
            <TextField
              select
              label="Región"
              fullWidth
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
            >
              <MenuItem value="">Todas las regiones</MenuItem>
              {ARGENTINA_REGIONS.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}

        {/* Provincia */}
        <Grid item xs={12} sm={isArgentina ? 3 : 3}>
          <Controller
            name="provinceId"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Provincia"
                fullWidth
                required
                value={field.value ?? ''}
                onChange={(e) => handleProvinceChange(Number(e.target.value))}
                disabled={!selectedCountryId}
                error={!!errors.provinceId}
                helperText={errors.provinceId?.message}
              >
                {filteredProvinces.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Localidad */}
        <Grid item xs={12} sm={isArgentina ? 3 : 3}>
          <Controller
            name="locationId"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Localidad"
                fullWidth
                required
                value={field.value ?? ''}
                onChange={(e) => field.onChange(Number(e.target.value))}
                disabled={!selectedProvinceId}
                error={!!errors.locationId}
                helperText={errors.locationId?.message}
              >
                {filteredLocations.map((l) => (
                  <MenuItem key={l.id} value={l.id}>
                    {l.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
