import { Controller, type UseFormReturn } from 'react-hook-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { COLOR_TOKENS } from '@jornadas/ui';
import type { CreateEventInput, PricingInput } from '@/lib/validations/event';

interface Props {
  form: UseFormReturn<CreateEventInput>;
}

const cardSx = {
  p: 2.5,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  mb: 2,
};

const subCardSx = {
  p: 2,
  borderRadius: 1.5,
  border: '1px solid',
  borderColor: 'divider',
  mb: 2,
};

const EMPTY_SYSTEM_ONE: PricingInput = {
  paymentSystem: 'SYSTEM_ONE',
  registrationEarlyDeadline: '',
  registrationEarlyAmount: 0,
  registrationLateDeadline: '',
  registrationLateAmount: 0,
  eventPaymentDeadline: '',
  eventPaymentEarlyAmount: 0,
  eventPaymentAtEventAmount: 0,
};

const EMPTY_SYSTEM_TWO: PricingInput = {
  paymentSystem: 'SYSTEM_TWO',
  registrationEarlyDeadline: '',
  registrationEarlyAmount: 0,
  registrationLateDeadline: '',
  registrationLateAmount: 0,
  installment1Deadline: '',
  installment1Amount: 0,
  installment2Amount: 0,
};

function calcTotal(p: PricingInput): { min: number; max: number } {
  if (p.paymentSystem === 'SYSTEM_ONE') {
    return {
      min: (p.registrationEarlyAmount || 0) + (p.eventPaymentEarlyAmount || 0),
      max: (p.registrationLateAmount || 0) + (p.eventPaymentAtEventAmount || 0),
    };
  }
  const base = (p.installment1Amount || 0) + (p.installment2Amount || 0);
  return {
    min: (p.registrationEarlyAmount || 0) + base,
    max: (p.registrationLateAmount || 0) + base,
  };
}

const fmt = (n: number) =>
  n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 });

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="overline" fontWeight={700} color="text.secondary" display="block" mb={1.5} lineHeight={1}>
      {children}
    </Typography>
  );
}

function DateAmountRow({
  dateLabel, dateValue, onDateChange,
  amountLabel, amountValue, onAmountChange,
  dateReadOnly,
}: {
  dateLabel: string; dateValue: string; onDateChange: (v: string) => void;
  amountLabel: string; amountValue: number; onAmountChange: (v: number) => void;
  dateReadOnly?: boolean;
}) {
  return (
    <Grid container spacing={2} mb={1.5}>
      <Grid item xs={12} sm={7}>
        <TextField
          label={dateLabel}
          type="date"
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
          value={dateValue}
          onChange={(e) => onDateChange(e.target.value)}
          disabled={dateReadOnly}
          placeholder={dateReadOnly ? 'En la jornada' : undefined}
        />
      </Grid>
      <Grid item xs={12} sm={5}>
        <TextField
          label={amountLabel}
          type="number"
          fullWidth
          size="small"
          inputProps={{ min: 0, step: 0.01 }}
          value={amountValue || ''}
          onChange={(e) => onAmountChange(Number(e.target.value))}
        />
      </Grid>
    </Grid>
  );
}

export function Step5Pricing({ form }: Props) {
  const { control, formState: { errors } } = form;

  const pricingErrors = errors.pricing as Record<string, { message?: string }> | undefined;
  const pricingErrorMessages = pricingErrors
    ? Object.values(pricingErrors).map((e) => e?.message).filter((m): m is string => typeof m === 'string')
    : [];

  return (
    <Controller
      name="pricing"
      control={control}
      render={({ field }) => {
        const pricing = field.value as PricingInput | null | undefined;
        const hasPricing = pricing != null;
        const system = pricing?.paymentSystem;

        const update = (patch: Partial<PricingInput>) => {
          if (!pricing) return;
          const updated = { ...pricing, ...patch } as PricingInput;
          const { min } = calcTotal(updated);
          field.onChange({ ...updated, totalAmount: min });
        };

        const enablePricing = () => field.onChange({ ...EMPTY_SYSTEM_ONE });
        const disablePricing = () => field.onChange(null);

        const switchSystem = (sys: 'SYSTEM_ONE' | 'SYSTEM_TWO') => {
          const regBase = pricing
            ? {
                registrationEarlyDeadline: pricing.registrationEarlyDeadline,
                registrationEarlyAmount: pricing.registrationEarlyAmount,
                registrationLateDeadline: pricing.registrationLateDeadline,
                registrationLateAmount: pricing.registrationLateAmount,
              }
            : {};
          const empty = sys === 'SYSTEM_ONE' ? EMPTY_SYSTEM_ONE : EMPTY_SYSTEM_TWO;
          field.onChange({ ...empty, ...regBase });
        };

        // Registration inputs shared between both systems
        const regSection = hasPricing && (
          <Box sx={subCardSx}>
            <SubLabel>Inscripción</SubLabel>
            <DateAmountRow
              dateLabel="Fecha límite (precio early)"
              dateValue={pricing.registrationEarlyDeadline}
              onDateChange={(v) => update({ registrationEarlyDeadline: v })}
              amountLabel="Monto early ($)"
              amountValue={pricing.registrationEarlyAmount}
              onAmountChange={(v) => update({ registrationEarlyAmount: v })}
            />
            <DateAmountRow
              dateLabel="Fecha límite (precio normal)"
              dateValue={pricing.registrationLateDeadline}
              onDateChange={(v) => update({ registrationLateDeadline: v })}
              amountLabel="Monto normal ($)"
              amountValue={pricing.registrationLateAmount}
              onAmountChange={(v) => update({ registrationLateAmount: v })}
            />
          </Box>
        );

        const total = hasPricing ? calcTotal(pricing) : null;

        return (
          <Box sx={cardSx}>
            {pricingErrorMessages.length > 0 && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {pricingErrorMessages.map((m, i) => <div key={i}>{m}</div>)}
              </Alert>
            )}

            {/* Toggle */}
            <FormControlLabel
              control={
                <Switch checked={hasPricing} onChange={(e) => (e.target.checked ? enablePricing() : disablePricing())} />
              }
              label={
                <Typography fontWeight={600}>
                  {hasPricing ? 'Este evento tiene costo' : 'Evento gratuito (sin costo)'}
                </Typography>
              }
              sx={{ mb: hasPricing ? 3 : 0 }}
            />

            {hasPricing && (
              <>
                {/* System selector */}
                <Box mb={3}>
                  <SubLabel>Sistema de pago</SubLabel>
                  <ToggleButtonGroup
                    exclusive
                    value={system}
                    onChange={(_, val) => { if (val) switchSystem(val); }}
                    size="small"
                  >
                    <ToggleButton type="button" value="SYSTEM_ONE" sx={{ px: 3 }}>
                      Sistema 1 — pago único
                    </ToggleButton>
                    <ToggleButton type="button" value="SYSTEM_TWO" sx={{ px: 3 }}>
                      Sistema 2 — dos cuotas
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {regSection}

                {/* System 1 */}
                {system === 'SYSTEM_ONE' && (
                  <Box sx={subCardSx}>
                    <SubLabel>Pago del evento</SubLabel>
                    <DateAmountRow
                      dateLabel="Fecha límite (precio early)"
                      dateValue={pricing.eventPaymentDeadline}
                      onDateChange={(v) => update({ eventPaymentDeadline: v })}
                      amountLabel="Monto early ($)"
                      amountValue={pricing.eventPaymentEarlyAmount}
                      onAmountChange={(v) => update({ eventPaymentEarlyAmount: v })}
                    />
                    <DateAmountRow
                      dateLabel="En la jornada"
                      dateValue=""
                      onDateChange={() => {}}
                      amountLabel="Monto en jornada ($)"
                      amountValue={pricing.eventPaymentAtEventAmount}
                      onAmountChange={(v) => update({ eventPaymentAtEventAmount: v })}
                      dateReadOnly
                    />
                  </Box>
                )}

                {/* System 2 */}
                {system === 'SYSTEM_TWO' && (
                  <Box sx={subCardSx}>
                    <SubLabel>Cuotas del evento</SubLabel>
                    <DateAmountRow
                      dateLabel="Fecha límite cuota 1"
                      dateValue={pricing.installment1Deadline}
                      onDateChange={(v) => update({ installment1Deadline: v })}
                      amountLabel="Monto cuota 1 ($)"
                      amountValue={pricing.installment1Amount}
                      onAmountChange={(v) => update({ installment1Amount: v })}
                    />
                    <DateAmountRow
                      dateLabel="En la jornada (cuota 2)"
                      dateValue=""
                      onDateChange={() => {}}
                      amountLabel="Monto cuota 2 ($)"
                      amountValue={pricing.installment2Amount}
                      onAmountChange={(v) => update({ installment2Amount: v })}
                      dateReadOnly
                    />
                  </Box>
                )}

                {/* Total */}
                {total && (total.min > 0 || total.max > 0) && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 1.5,
                        bgcolor: `${COLOR_TOKENS.brand}15`,
                        border: `1px solid ${COLOR_TOKENS.brand}40`,
                      }}
                    >
                      <SubLabel>Total estimado</SubLabel>
                      {total.min === total.max ? (
                        <Typography variant="h6" fontWeight={700} color="primary">
                          {fmt(total.min)}
                        </Typography>
                      ) : (
                        <Typography variant="h6" fontWeight={700} color="primary">
                          {fmt(total.min)} — {fmt(total.max)}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {system === 'SYSTEM_ONE'
                          ? 'Mínimo (todo early) — Máximo (todo en jornada)'
                          : 'Mínimo (inscripción early) — Máximo (inscripción normal)'}
                      </Typography>
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>
        );
      }}
    />
  );
}
