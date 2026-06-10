'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector from '@mui/material/StepConnector';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { type StepIconProps } from '@mui/material/StepIcon';
import { Check } from 'lucide-react';
import { COLOR_TOKENS } from '@jornadas/ui';
import { createEventSchema, type CreateEventInput } from '@/lib/validations/event';
import { Step1BasicInfo } from './steps/Step1BasicInfo';
import { Step2Dates } from './steps/Step2Dates';
import { Step3Location } from './steps/Step3Location';
import { Step4About } from './steps/Step4About';
import { Step5Contact } from './steps/Step5Contact';
import { Step5Pricing } from './steps/Step5Pricing';
import { Step6Review } from './steps/Step6Review';

export interface Country { id: number; name: string }
export interface Province { id: number; name: string; countryId: number; region: string | null; country: Country }
export interface Location { id: number; name: string; provinceId: number }

export interface EventData {
  id: number;
  title: string;
  imageUrl: string | null;
  imageUrl2: string | null;
  startDate: Date | string;
  endDate: Date | string;
  countryId: number;
  provinceId: number;
  locationId: number;
  description: string | null;
  hostChurch: string | null;
  activities: string | null;
  extraInfo: string | null;
  targetAudience: string | null;
  capacity: number | null;
  registrationLink: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  pricing?: {
    paymentSystem: string;
    registrationEarlyDeadline: Date | string;
    registrationEarlyAmount: unknown;
    registrationLateDeadline: Date | string;
    registrationLateAmount: unknown;
    eventPaymentDeadline: Date | string | null;
    eventPaymentEarlyAmount: unknown | null;
    eventPaymentAtEventAmount: unknown | null;
    installment1Deadline: Date | string | null;
    installment1Amount: unknown | null;
    installment2Amount: unknown | null;
    totalAmount: unknown | null;
  } | null;
}

// ── Stepper config ─────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Datos básicos', desc: 'Título e imágenes' },
  { label: 'Fechas', desc: 'Inicio y fin del evento' },
  { label: 'Ubicación', desc: 'País, provincia, localidad' },
  { label: 'Sobre el evento', desc: 'Descripción y detalles' },
  { label: 'Contacto', desc: 'Datos del organizador' },
  { label: 'Pagos', desc: 'Aranceles e inscripción' },
  { label: 'Revisión', desc: 'Confirmar y publicar' },
];

// ── Error helpers ──────────────────────────────────────────────────────────────

// Fields that live in each step (for error display and validation)
const STEP_FIELDS: Record<number, string[]> = {
  0: ['title'],
  1: ['startDate', 'endDate'],
  2: ['countryId', 'provinceId', 'locationId'],
  3: ['description', 'hostChurch', 'activities', 'extraInfo', 'targetAudience', 'capacity', 'registrationLink'],
  4: ['contactName', 'contactEmail', 'contactPhone'],
  5: ['pricing'],
};

// Fields that block "Next" if invalid
const STEP_TRIGGER_FIELDS: Record<number, (keyof CreateEventInput)[]> = {
  0: ['title'],
  1: ['startDate', 'endDate'],
  2: ['countryId', 'provinceId', 'locationId'],
  3: [],
  4: ['contactName', 'contactEmail', 'contactPhone'],
  5: ['pricing'],
};

const FIELD_LABELS: Record<string, string> = {
  title: 'Título del evento',
  startDate: 'Fecha de inicio',
  endDate: 'Fechas del evento',
  countryId: 'País',
  provinceId: 'Provincia',
  locationId: 'Localidad',
  description: 'Descripción',
  hostChurch: 'Iglesia anfitriona',
  activities: 'Actividades',
  extraInfo: 'Información extra',
  targetAudience: '¿Quiénes pueden asistir?',
  capacity: 'Cantidad de cupos',
  registrationLink: 'Link de inscripción',
  contactName: 'Nombre de contacto',
  contactEmail: 'Email de contacto',
  contactPhone: 'Teléfono (WhatsApp)',
  pricing: 'Pagos y aranceles',
};

interface ErrorItem { field: string; label: string; message: string }

function extractFirstMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return '';
  const rec = error as Record<string, unknown>;
  if (typeof rec.message === 'string' && rec.message) return rec.message;
  for (const val of Object.values(rec)) {
    const msg = extractFirstMessage(val);
    if (msg) return msg;
  }
  return '';
}

function buildStepErrors(
  formErrors: FieldErrors<CreateEventInput>,
  fields: string[],
): ErrorItem[] {
  return fields
    .flatMap((field) => {
      const error = formErrors[field as keyof CreateEventInput];
      const message = extractFirstMessage(error);
      if (!message) return [];
      return [{ field, label: FIELD_LABELS[field] ?? field, message }];
    });
}

// ── Error sub-components ───────────────────────────────────────────────────────

function StepErrorBanner({
  step,
  formErrors,
}: {
  step: number;
  formErrors: FieldErrors<CreateEventInput>;
}) {
  const errors = buildStepErrors(formErrors, STEP_FIELDS[step] ?? []);
  if (errors.length === 0) return null;

  return (
    <Alert severity="error" sx={{ mb: 3 }}>
      <AlertTitle sx={{ fontWeight: 700 }}>
        {errors.length === 1
          ? 'Hay un campo con error en este paso'
          : `Hay ${errors.length} campos con errores en este paso`}
      </AlertTitle>
      <Box component="ul" sx={{ m: 0, pl: 2 }}>
        {errors.map((e) => (
          <Typography key={e.field} component="li" variant="body2" sx={{ my: 0.25 }}>
            <strong>{e.label}:</strong>{' '}{e.message}
          </Typography>
        ))}
      </Box>
    </Alert>
  );
}

function ReviewErrorSummary({
  formErrors,
  onGoToStep,
}: {
  formErrors: FieldErrors<CreateEventInput>;
  onGoToStep: (step: number) => void;
}) {
  const stepsWithErrors = Object.entries(STEP_FIELDS)
    .map(([s, fields]) => ({ step: Number(s), errors: buildStepErrors(formErrors, fields) }))
    .filter(({ errors }) => errors.length > 0);

  if (stepsWithErrors.length === 0) return null;

  const totalErrors = stepsWithErrors.reduce((acc, s) => acc + s.errors.length, 0);

  return (
    <Alert
      severity="warning"
      sx={{
        mb: 3,
        '& .MuiAlert-message': { width: '100%' },
      }}
    >
      <AlertTitle sx={{ fontWeight: 700 }}>
        {totalErrors === 1
          ? '1 campo con error — corregilos antes de guardar'
          : `${totalErrors} campos con errores — corregilos antes de guardar`}
      </AlertTitle>

      <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {stepsWithErrors.map(({ step, errors }) => (
          <Box
            key={step}
            sx={{
              p: 1.5,
              borderRadius: 1,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'warning.light',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
              <Typography variant="body2" fontWeight={700} color="text.primary">
                Paso {step + 1} — {STEPS[step]?.label}
              </Typography>
              <Button
                type="button"
                size="small"
                variant="outlined"
                color="warning"
                onClick={() => onGoToStep(step)}
                sx={{ py: 0.25, px: 1.5, fontSize: '0.7rem', minWidth: 0 }}
              >
                Ir al paso →
              </Button>
            </Box>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {errors.map((e) => (
                <Typography
                  key={e.field}
                  component="li"
                  variant="body2"
                  color="text.secondary"
                  sx={{ my: 0.2 }}
                >
                  <strong>{e.label}:</strong>{' '}{e.message}
                </Typography>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Alert>
  );
}

// ── Step icon ──────────────────────────────────────────────────────────────────

function EventStepIcon({ active, completed, icon }: StepIconProps) {
  return (
    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 17,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        ...(completed && {
          bgcolor: COLOR_TOKENS.brand,
          color: '#fff',
          boxShadow: `0 4px 14px ${COLOR_TOKENS.brand}55`,
        }),
        ...(active && !completed && {
          bgcolor: COLOR_TOKENS.brand,
          color: '#fff',
          transform: 'scale(1.2)',
          boxShadow: `0 0 0 8px ${COLOR_TOKENS.brand}25, 0 6px 20px ${COLOR_TOKENS.brand}60`,
          animation: 'stepPulse 2.4s ease-in-out infinite',
          '@keyframes stepPulse': {
            '0%, 100%': { boxShadow: `0 0 0 8px ${COLOR_TOKENS.brand}25, 0 6px 20px ${COLOR_TOKENS.brand}60` },
            '50%': { boxShadow: `0 0 0 14px ${COLOR_TOKENS.brand}0d, 0 6px 24px ${COLOR_TOKENS.brand}70` },
          },
        }),
        ...(!active && !completed && {
          bgcolor: 'action.selected',
          color: 'text.disabled',
        }),
      }}
    >
      {completed ? <Check size={22} strokeWidth={2.5} /> : icon}
    </Box>
  );
}

// ── Default values builder ─────────────────────────────────────────────────────

const fmtDate = (d: Date | string) => new Date(d).toISOString().slice(0, 10);
const toNum = (v: unknown): number | undefined => (v != null ? Number(v) : undefined);

function buildDefaultValues(event?: EventData): Partial<CreateEventInput> {
  if (!event) return {};

  const base: Partial<CreateEventInput> = {
    title: event.title,
    imageUrl: event.imageUrl ?? undefined,
    imageUrl2: event.imageUrl2 ?? undefined,
    startDate: fmtDate(event.startDate),
    endDate: fmtDate(event.endDate),
    countryId: event.countryId,
    provinceId: event.provinceId,
    locationId: event.locationId,
    description: event.description ?? undefined,
    hostChurch: event.hostChurch ?? undefined,
    activities: event.activities ?? undefined,
    extraInfo: event.extraInfo ?? undefined,
    targetAudience: event.targetAudience ?? undefined,
    capacity: event.capacity ?? undefined,
    registrationLink: event.registrationLink ?? undefined,
    contactName: event.contactName ?? undefined,
    contactEmail: event.contactEmail ?? undefined,
    contactPhone: event.contactPhone ?? undefined,
  };

  const p = event.pricing;
  if (!p) return base;

  if (p.paymentSystem === 'SYSTEM_ONE') {
    return {
      ...base,
      pricing: {
        paymentSystem: 'SYSTEM_ONE',
        registrationEarlyDeadline: fmtDate(p.registrationEarlyDeadline as Date),
        registrationEarlyAmount: toNum(p.registrationEarlyAmount)!,
        registrationLateDeadline: fmtDate(p.registrationLateDeadline as Date),
        registrationLateAmount: toNum(p.registrationLateAmount)!,
        eventPaymentDeadline: p.eventPaymentDeadline ? fmtDate(p.eventPaymentDeadline as Date) : '',
        eventPaymentEarlyAmount: toNum(p.eventPaymentEarlyAmount) ?? 0,
        eventPaymentAtEventAmount: toNum(p.eventPaymentAtEventAmount) ?? 0,
        totalAmount: toNum(p.totalAmount),
      },
    };
  }

  return {
    ...base,
    pricing: {
      paymentSystem: 'SYSTEM_TWO',
      registrationEarlyDeadline: fmtDate(p.registrationEarlyDeadline as Date),
      registrationEarlyAmount: toNum(p.registrationEarlyAmount)!,
      registrationLateDeadline: fmtDate(p.registrationLateDeadline as Date),
      registrationLateAmount: toNum(p.registrationLateAmount)!,
      installment1Deadline: p.installment1Deadline ? fmtDate(p.installment1Deadline as Date) : '',
      installment1Amount: toNum(p.installment1Amount) ?? 0,
      installment2Amount: toNum(p.installment2Amount) ?? 0,
      totalAmount: toNum(p.totalAmount),
    },
  };
}

// ── Main component ─────────────────────────────────────────────────────────────

interface Props {
  event?: EventData;
  countries: Country[];
  provinces: Province[];
  locations: Location[];
  fromClone?: boolean;
}

export function EventForm({ event, countries, provinces, locations, fromClone }: Props) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  // Tracks which steps the user has tried to advance from (to show inline banners)
  const [attemptedSteps, setAttemptedSteps] = useState(new Set<number>());
  // True once the user has entered the Review step (pre-validates all fields)
  const [reviewValidated, setReviewValidated] = useState(false);
  const isEditing = !!event;

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: buildDefaultValues(event),
    mode: 'onTouched',
  });

  const {
    handleSubmit,
    trigger,
    formState: { isSubmitting, errors: formErrors },
  } = form;

  const handleNext = async () => {
    const fieldsToValidate = STEP_TRIGGER_FIELDS[activeStep];
    let valid = true;

    if (fieldsToValidate && fieldsToValidate.length > 0) {
      valid = await trigger(fieldsToValidate);
    }

    // Cross-field date validation: schema-level .refine() may not be caught
    // by field-specific trigger, so we check it explicitly here.
    if (activeStep === 1 && valid) {
      const sd = form.getValues('startDate');
      const ed = form.getValues('endDate');
      if (sd && ed && new Date(ed) < new Date(sd)) {
        form.setError('endDate', {
          type: 'manual',
          message: 'La fecha de inicio no puede ser mayor a la de fin',
        });
        valid = false;
      }
    }

    // Mark this step as attempted so the inline banner activates
    setAttemptedSteps((prev) => new Set([...prev, activeStep]));

    if (!valid) return;

    // Entering Review: pre-validate the whole form so the summary is ready
    if (activeStep === STEPS.length - 2) {
      await trigger();
      setReviewValidated(true);
    }

    setActiveStep((s) => s + 1);
  };

  const onError = (_errors: FieldErrors<CreateEventInput>) => {
    // Stay on Review step — the ReviewErrorSummary picks up from formErrors directly
    setReviewValidated(true);
  };

  const onSubmit = async (data: CreateEventInput) => {
    const toastId = toast.loading(isEditing ? 'Actualizando...' : 'Creando evento...');
    const res = await fetch(isEditing ? `/api/events/${event!.id}` : '/api/events', {
      method: isEditing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success(isEditing ? 'Evento actualizado' : 'Evento creado', { id: toastId });
      router.push('/dashboard/events');
      router.refresh();
    } else {
      const json = (await res.json()) as { error?: { formErrors?: string[] } };
      toast.error(json.error?.formErrors?.[0] ?? 'Error al guardar el evento', { id: toastId });
    }
  };

  const progressPct = Math.round((activeStep / (STEPS.length - 1)) * 100);

  return (
    <Box>
      {fromClone && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Este evento es una copia. Recordá cargar las imágenes en el <strong>Paso 1</strong> antes de guardar.
        </Alert>
      )}

      {/* ── Stepper ───────────────────────────────────────────────────────── */}
      <Box sx={{ py: 4 }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={
            <StepConnector
              sx={{
                top: 25,
                left: 'calc(-50% + 32px)',
                right: 'calc(50% + 32px)',
                '& .MuiStepConnector-line': {
                  borderTopWidth: 3,
                  borderRadius: 2,
                  transition: 'border-color 0.4s ease',
                },
                '&.Mui-active .MuiStepConnector-line': { borderColor: COLOR_TOKENS.brand },
                '&.Mui-completed .MuiStepConnector-line': { borderColor: COLOR_TOKENS.brand },
              }}
            />
          }
        >
          {STEPS.map((step, i) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={EventStepIcon}
                sx={{ '& .MuiStepLabel-labelContainer': { mt: 1.5 } }}
                optional={
                  <Typography
                    variant="caption"
                    color={activeStep === i ? 'primary.light' : 'text.disabled'}
                    display="block"
                    textAlign="center"
                    lineHeight={1.3}
                    sx={{ fontSize: '0.7rem' }}
                  >
                    {step.desc}
                  </Typography>
                }
              >
                <Typography
                  variant="body2"
                  fontWeight={activeStep === i ? 700 : 400}
                  color={activeStep === i ? 'primary' : activeStep > i ? 'text.primary' : 'text.disabled'}
                  textAlign="center"
                >
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* ── Progress bar + current step heading ───────────────────────────── */}
      <Box sx={{ mb: 5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={1.5}>
          <Box>
            <Typography variant="overline" color="text.secondary" lineHeight={1}>
              Paso {activeStep + 1} de {STEPS.length}
            </Typography>
            <Typography variant="h6" fontWeight={700} mt={0.25}>
              {STEPS[activeStep]?.label}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.25}>
              {STEPS[activeStep]?.desc}
            </Typography>
          </Box>
          <Typography variant="h5" color="primary" fontWeight={800} lineHeight={1}>
            {progressPct}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressPct}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'action.selected',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: `linear-gradient(90deg, ${COLOR_TOKENS.brand}, ${COLOR_TOKENS.extra2})`,
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            },
          }}
        />
      </Box>

      {/* ── Step content ──────────────────────────────────────────────────── */}
      <Box component="form" onSubmit={(e) => e.preventDefault()} noValidate>
        <Box pb={14}>
          {/* Per-step inline error banner (steps 0–5) */}
          {activeStep < STEPS.length - 1 && attemptedSteps.has(activeStep) && (
            <StepErrorBanner step={activeStep} formErrors={formErrors} />
          )}

          {/* Review step error summary (step 6) */}
          {activeStep === STEPS.length - 1 && reviewValidated && (
            <ReviewErrorSummary formErrors={formErrors} onGoToStep={setActiveStep} />
          )}

          {activeStep === 0 && <Step1BasicInfo form={form} />}
          {activeStep === 1 && <Step2Dates form={form} />}
          {activeStep === 2 && (
            <Step3Location form={form} countries={countries} provinces={provinces} locations={locations} />
          )}
          {activeStep === 3 && <Step4About form={form} />}
          {activeStep === 4 && <Step5Contact form={form} />}
          {activeStep === 5 && <Step5Pricing form={form} />}
          {activeStep === 6 && (
            <Step6Review
              form={form}
              countries={countries}
              provinces={provinces}
              locations={locations}
              onGoToStep={setActiveStep}
            />
          )}
        </Box>

        {/* ── Fixed navigation bar ──────────────────────────────────────── */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 'var(--sidebar-width, 260px)',
            right: 0,
            zIndex: 1200,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 -8px 32px rgba(0,0,0,0.22)',
            transition: 'left 0.3s ease',
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 6 },
              py: 2.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={activeStep === 0 ? () => router.back() : () => setActiveStep((s) => s - 1)}
              disabled={isSubmitting}
              sx={{ px: 4, py: 1.2, minWidth: 140 }}
            >
              {activeStep === 0 ? 'Cancelar' : '← Anterior'}
            </Button>

            {activeStep < STEPS.length - 1 ? (
              <Button
                type="button"
                variant="contained"
                size="large"
                onClick={handleNext}
                sx={{ px: 5, py: 1.2, minWidth: 160 }}
              >
                Siguiente →
              </Button>
            ) : (
              <Button
                type="button"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                onClick={() => void handleSubmit(onSubmit, onError)()}
                sx={{ px: 6, py: 1.2, minWidth: 180 }}
              >
                {isSubmitting ? (
                  <CircularProgress size={22} color="inherit" />
                ) : isEditing ? (
                  'Actualizar Evento'
                ) : (
                  'Crear Evento ✓'
                )}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
