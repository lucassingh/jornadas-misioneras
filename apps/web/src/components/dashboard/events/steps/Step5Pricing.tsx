import { useController, type UseFormReturn } from 'react-hook-form';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarClock, Tag } from 'lucide-react';
import { COLOR_TOKENS } from '@jornadas/ui';
import type { CreateEventInput } from '@/lib/validations/event';
import { getPricingDeadlines, PRICING_TIER_COPY, formatPrice } from '@/lib/pricing';

interface Props {
  form: UseFormReturn<CreateEventInput>;
}

const cardSx = {
  p: { xs: 2.5, md: 4 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  mb: 2,
};

const fmtDeadline = (d: Date) => format(d, "d 'de' MMMM 'de' yyyy", { locale: es });

// ── Fila: "cuándo se paga" + fecha límite derivada + monto ────────────────────

function PriceRow({
  form,
  name,
  description,
  deadline,
  accent,
}: {
  form: UseFormReturn<CreateEventInput>;
  name: 'pricing.priceTwoMonthsBefore' | 'pricing.priceOneMonthBefore';
  description: string;
  deadline: Date | null;
  accent: string;
}) {
  const { field, fieldState } = useController({ name, control: form.control });

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 220px' },
        gap: { xs: 1.5, sm: 3 },
        alignItems: 'center',
        py: 2.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Box
          sx={{
            width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: `${accent}1a`, color: accent,
          }}
        >
          <CalendarClock size={17} />
        </Box>
        <Box>
          <Typography variant="body1" fontWeight={700} lineHeight={1.3}>
            {description}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" mt={0.25}>
            {deadline
              ? <>Se puede pagar hasta el <strong>{fmtDeadline(deadline)}</strong></>
              : 'Cargá la fecha de inicio (paso 2) para ver hasta qué día aplica este precio'}
          </Typography>
        </Box>
      </Box>

      <TextField
        label="Monto"
        type="number"
        size="small"
        fullWidth
        inputProps={{ min: 0, step: 1, inputMode: 'numeric' }}
        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
        value={field.value ?? ''}
        onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        onBlur={field.onBlur}
        inputRef={field.ref}
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
      />
    </Box>
  );
}

// ── Step ──────────────────────────────────────────────────────────────────────

export function Step5Pricing({ form }: Props) {
  const { watch, setValue, clearErrors } = form;

  const pricing = watch('pricing');
  const startDate = watch('startDate');
  const hasPricing = pricing != null;
  const deadlines = getPricingDeadlines(startDate);

  const toggle = (checked: boolean) => {
    if (checked) {
      // Montos vacíos a propósito: el schema los marca como requeridos al avanzar.
      setValue('pricing', { priceTwoMonthsBefore: undefined, priceOneMonthBefore: undefined } as unknown as CreateEventInput['pricing'], { shouldDirty: true });
    } else {
      setValue('pricing', null, { shouldDirty: true });
      clearErrors('pricing');
    }
  };

  const two = pricing?.priceTwoMonthsBefore;
  const one = pricing?.priceOneMonthBefore;
  const bothLoaded = typeof two === 'number' && typeof one === 'number' && two > 0 && one > 0;
  const isSingle = bothLoaded && two === one;

  return (
    <Box data-tour="eventForm.step5.panel" sx={cardSx}>
      <Typography variant="body2" color="text.secondary" mb={2.5}>
        Dos montos según cuándo se pague. Pagar antes sale más barato.
      </Typography>

      <FormControlLabel
        control={<Switch checked={hasPricing} onChange={(e) => toggle(e.target.checked)} />}
        label={
          <Typography fontWeight={600}>
            {hasPricing ? 'Este evento tiene costo' : 'Evento gratuito (sin costo)'}
          </Typography>
        }
        sx={{ mb: hasPricing ? 3 : 0 }}
      />

      {hasPricing && (
        <>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Hay dos precios según cuándo se abone: un monto si se paga <strong>dos meses antes</strong> del
            evento y otro, un poco más alto, si se paga <strong>un mes antes</strong>. Completá el valor de cada uno.
          </Typography>

          <Box
            sx={{
              mt: 2,
              px: { xs: 2, md: 3 },
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <PriceRow
              form={form}
              name="pricing.priceTwoMonthsBefore"
              description={PRICING_TIER_COPY.twoMonths.description}
              deadline={deadlines?.twoMonthsBefore ?? null}
              accent={COLOR_TOKENS.brand}
            />
            <PriceRow
              form={form}
              name="pricing.priceOneMonthBefore"
              description={PRICING_TIER_COPY.oneMonth.description}
              deadline={deadlines?.oneMonthBefore ?? null}
              accent="#f59e0b"
            />
          </Box>

          {/* Resumen en vivo */}
          {bothLoaded && (
            <Box
              sx={{
                mt: 2, p: 2, borderRadius: 2,
                bgcolor: `${COLOR_TOKENS.brand}10`,
                border: `1px solid ${COLOR_TOKENS.brand}30`,
                display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap',
              }}
            >
              <Tag size={16} color={COLOR_TOKENS.brand} />
              {isSingle ? (
                <Typography variant="body2">
                  Precio único: <strong>{formatPrice(two)}</strong> sin importar cuándo se pague.
                </Typography>
              ) : (
                <Typography variant="body2">
                  Pagando con tiempo se ahorra <strong>{formatPrice(one - two)}</strong>
                  {' '}({formatPrice(two)} vs. {formatPrice(one)}).
                </Typography>
              )}
              <Chip
                size="small"
                variant="outlined"
                color="primary"
                label={isSingle ? 'Precio único' : 'Dos tramos'}
                sx={{ ml: 'auto' }}
              />
            </Box>
          )}

          <Alert severity="info" icon={false} sx={{ mt: 2.5 }}>
            <AlertTitle sx={{ fontWeight: 700, fontSize: '0.85rem' }}>A tener en cuenta</AlertTitle>
            <Box component="ul" sx={{ m: 0, pl: 2.25 }}>
              <Typography component="li" variant="body2" sx={{ my: 0.25 }}>
                El monto de “dos meses antes” debe ser menor o igual al de “un mes antes”.
              </Typography>
              <Typography component="li" variant="body2" sx={{ my: 0.25 }}>
                Si el precio es único (no cambia según cuándo se pague), escribí el mismo valor en las dos filas.
              </Typography>
              <Typography component="li" variant="body2" sx={{ my: 0.25 }}>
                Ejemplo: dos meses antes <strong>$150.000</strong> · un mes antes <strong>$165.000</strong>.
              </Typography>
            </Box>
          </Alert>
        </>
      )}
    </Box>
  );
}
