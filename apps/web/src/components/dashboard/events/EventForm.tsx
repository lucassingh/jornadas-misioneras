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

// ── Helpers ────────────────────────────────────────────────────────────────────

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

// ── Component ──────────────────────────────────────────────────────────────────

interface Props {
  event?: EventData;
  countries: Country[];
  provinces: Province[];
  locations: Location[];
}

export function EventForm({ event, countries, provinces, locations }: Props) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const isEditing = !!event;

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: buildDefaultValues(event),
    mode: 'onTouched',
  });

  const { handleSubmit, trigger, formState: { isSubmitting } } = form;

  const handleNext = async () => {
    let valid = true;
    if (activeStep === 0) valid = await trigger(['title']);
    if (activeStep === 1) valid = await trigger(['startDate', 'endDate']);
    if (activeStep === 2) valid = await trigger(['countryId', 'provinceId', 'locationId']);
    if (valid) setActiveStep((s) => s + 1);
  };

  // Maps field names to the step where they live
  const FIELD_STEP_MAP: Record<string, number> = {
    title: 0, imageUrl: 0, imageUrl2: 0,
    startDate: 1, endDate: 1,
    countryId: 2, provinceId: 2, locationId: 2,
    description: 3, hostChurch: 3, activities: 3, extraInfo: 3,
    targetAudience: 3, capacity: 3, registrationLink: 3,
    contactName: 4, contactEmail: 4, contactPhone: 4,
    pricing: 5,
  };

  const onError = (errors: FieldErrors<CreateEventInput>) => {
    const firstErrorField = Object.keys(errors)[0] ?? '';
    const targetStep = FIELD_STEP_MAP[firstErrorField] ?? 0;

    const extractMessages = (obj: unknown): string[] => {
      if (!obj || typeof obj !== 'object') return [];
      const record = obj as Record<string, unknown>;
      if (typeof record.message === 'string') return [record.message];
      return Object.values(record).flatMap(extractMessages);
    };

    const messages = Object.values(errors).flatMap(extractMessages).slice(0, 2);

    toast.error(
      messages.length > 0 ? messages.join(' · ') : 'Revisá los campos del formulario antes de continuar'
    );
    setActiveStep(targetStep);
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
                sx={{
                  '& .MuiStepLabel-labelContainer': { mt: 1.5 },
                }}
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
        {/* Padding bottom so content isn't hidden behind the sticky bar */}
        <Box pb={14}>
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

        {/* ── Fixed navigation bar — content area width only ───────────── */}
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
              <Button type="button" variant="contained" size="large" onClick={handleNext} sx={{ px: 5, py: 1.2, minWidth: 160 }}>
                Siguiente →
              </Button>
            ) : (
              <Button type="button" variant="contained" size="large" disabled={isSubmitting} onClick={() => void handleSubmit(onSubmit, onError)()} sx={{ px: 6, py: 1.2, minWidth: 180 }}>
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
