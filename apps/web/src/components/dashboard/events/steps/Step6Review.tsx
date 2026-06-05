import { type UseFormReturn } from 'react-hook-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { format, parseISO, differenceInDays, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pencil } from 'lucide-react';
import { COLOR_TOKENS } from '@jornadas/ui';
import type { CreateEventInput } from '@/lib/validations/event';
import type { Country, Province, Location } from '../EventForm';

interface Props {
  form: UseFormReturn<CreateEventInput>;
  countries: Country[];
  provinces: Province[];
  locations: Location[];
  onGoToStep: (step: number) => void;
}

const REGION_LABELS: Record<string, string> = {
  NOA: 'Noroeste (NOA)', NEA: 'Noreste (NEA)', CUYO: 'Cuyo',
  CENTRO: 'Centro', PAMPEANA: 'Pampeana', METROPOLITANA: 'Metropolitana (AMBA)', PATAGONIA: 'Patagonia',
};

const fmtDate = (s?: string | null) => {
  if (!s) return '—';
  const d = parseISO(s);
  return isValid(d) ? format(d, "d 'de' MMMM 'de' yyyy", { locale: es }) : '—';
};

const fmtCurrency = (n?: number | null) =>
  n != null ? n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }) : '—';

const cardSx = { p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', mb: 2 };

function SectionHeader({ label, step, onEdit }: { label: string; step: number; onEdit: (s: number) => void }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="overline" fontWeight={700} color="text.secondary" lineHeight={1}>{label}</Typography>
      <Button type="button" size="small" startIcon={<Pencil size={13} />} onClick={() => onEdit(step)} sx={{ minWidth: 0, px: 1.5 }}>
        Editar
      </Button>
    </Box>
  );
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null;
  return (
    <Box mb={1}>
      <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
      <Typography variant="body2">{String(value)}</Typography>
    </Box>
  );
}

export function Step6Review({ form, countries, provinces, locations, onGoToStep }: Props) {
  const values = form.watch();

  const country = countries.find((c) => c.id === Number(values.countryId));
  const province = provinces.find((p) => p.id === Number(values.provinceId));
  const location = locations.find((l) => l.id === Number(values.locationId));

  const duration = (() => {
    if (!values.startDate || !values.endDate) return null;
    const s = parseISO(values.startDate);
    const e = parseISO(values.endDate);
    if (!isValid(s) || !isValid(e)) return null;
    const d = differenceInDays(e, s);
    return d >= 0 ? d + 1 : null;
  })();

  const pricing = values.pricing;

  return (
    <Box>
      <Box sx={{ p: 2, borderRadius: 2, bgcolor: `${COLOR_TOKENS.extra2}18`, mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Revisá toda la información antes de crear el evento. Podés volver a cualquier sección.
        </Typography>
      </Box>

      {/* Datos básicos — step 0 */}
      <Box sx={cardSx}>
        <SectionHeader label="Datos básicos" step={0} onEdit={onGoToStep} />
        <Row label="Título" value={values.title} />
        {(values.imageUrl || values.imageUrl2) ? (
          <Grid container spacing={1.5} mt={0.5}>
            {values.imageUrl && (
              <Grid item xs={6}>
                <Box component="img" src={values.imageUrl} alt="Principal"
                  sx={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 1.5 }} />
                <Typography variant="caption" color="text.secondary">Principal</Typography>
              </Grid>
            )}
            {values.imageUrl2 && (
              <Grid item xs={6}>
                <Box component="img" src={values.imageUrl2} alt="Secundaria"
                  sx={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 1.5 }} />
                <Typography variant="caption" color="text.secondary">Secundaria</Typography>
              </Grid>
            )}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">Sin imágenes</Typography>
        )}
      </Box>

      {/* Fechas — step 1 */}
      <Box sx={cardSx}>
        <SectionHeader label="Fechas" step={1} onEdit={onGoToStep} />
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4}><Row label="Inicio" value={fmtDate(values.startDate)} /></Grid>
          <Grid item xs={6} sm={4}><Row label="Fin" value={fmtDate(values.endDate)} /></Grid>
          <Grid item xs={12} sm={4}>
            {duration && (
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Duración</Typography>
                <Chip label={`${duration} ${duration === 1 ? 'día' : 'días'}`} size="small" color="primary" variant="outlined" />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Ubicación — step 2 */}
      <Box sx={cardSx}>
        <SectionHeader label="Ubicación" step={2} onEdit={onGoToStep} />
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}><Row label="País" value={country?.name} /></Grid>
          {province?.region && (
            <Grid item xs={6} sm={3}><Row label="Región" value={REGION_LABELS[province.region] ?? province.region} /></Grid>
          )}
          <Grid item xs={6} sm={3}><Row label="Provincia" value={province?.name} /></Grid>
          <Grid item xs={6} sm={3}><Row label="Localidad" value={location?.name} /></Grid>
        </Grid>
      </Box>

      {/* Sobre el evento — step 3 */}
      <Box sx={cardSx}>
        <SectionHeader label="Sobre el evento" step={3} onEdit={onGoToStep} />
        {!values.description && !values.hostChurch && !values.activities &&
         !values.extraInfo && !values.targetAudience && !values.capacity && !values.registrationLink ? (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">Sin información adicional</Typography>
        ) : (
          <>
            <Row label="Descripción" value={values.description} />
            <Row label="Iglesia anfitriona" value={values.hostChurch} />
            <Row label="Actividades" value={values.activities} />
            <Row label="Información extra" value={values.extraInfo} />
            <Row label="¿Quiénes pueden asistir?" value={values.targetAudience} />
            <Row label="Cupos disponibles" value={values.capacity} />
            <Row label="Link de inscripción" value={values.registrationLink} />
          </>
        )}
      </Box>

      {/* Contacto — step 4 */}
      <Box sx={cardSx}>
        <SectionHeader label="Datos de contacto" step={4} onEdit={onGoToStep} />
        {!values.contactName && !values.contactEmail && !values.contactPhone ? (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">Sin datos de contacto</Typography>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}><Row label="Nombre" value={values.contactName} /></Grid>
            <Grid item xs={12} sm={4}><Row label="Email" value={values.contactEmail} /></Grid>
            <Grid item xs={12} sm={4}><Row label="WhatsApp" value={values.contactPhone} /></Grid>
          </Grid>
        )}
      </Box>

      {/* Pagos — step 5 */}
      <Box sx={cardSx}>
        <SectionHeader label="Pagos y aranceles" step={5} onEdit={onGoToStep} />
        {!pricing ? (
          <Chip label="Evento gratuito" color="success" variant="outlined" size="small" />
        ) : (
          <>
            <Chip
              label={pricing.paymentSystem === 'SYSTEM_ONE' ? 'Sistema 1 — pago único' : 'Sistema 2 — dos cuotas'}
              color="primary" variant="outlined" size="small" sx={{ mb: 2 }}
            />

            <Typography variant="caption" color="text.secondary" display="block" mb={1} fontWeight={700}>INSCRIPCIÓN</Typography>
            <Grid container spacing={1} mb={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" display="block">Early (hasta {fmtDate(pricing.registrationEarlyDeadline)})</Typography>
                <Typography variant="body2" fontWeight={600}>{fmtCurrency(pricing.registrationEarlyAmount)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" display="block">Normal (hasta {fmtDate(pricing.registrationLateDeadline)})</Typography>
                <Typography variant="body2" fontWeight={600}>{fmtCurrency(pricing.registrationLateAmount)}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 1.5 }} />

            {pricing.paymentSystem === 'SYSTEM_ONE' && (
              <>
                <Typography variant="caption" color="text.secondary" display="block" mb={1} fontWeight={700}>PAGO DEL EVENTO</Typography>
                <Grid container spacing={1} mb={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" display="block">Early (hasta {fmtDate(pricing.eventPaymentDeadline)})</Typography>
                    <Typography variant="body2" fontWeight={600}>{fmtCurrency(pricing.eventPaymentEarlyAmount)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" display="block">En la jornada</Typography>
                    <Typography variant="body2" fontWeight={600}>{fmtCurrency(pricing.eventPaymentAtEventAmount)}</Typography>
                  </Grid>
                </Grid>
              </>
            )}

            {pricing.paymentSystem === 'SYSTEM_TWO' && (
              <>
                <Typography variant="caption" color="text.secondary" display="block" mb={1} fontWeight={700}>CUOTAS DEL EVENTO</Typography>
                <Grid container spacing={1} mb={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" display="block">Cuota 1 (hasta {fmtDate(pricing.installment1Deadline)})</Typography>
                    <Typography variant="body2" fontWeight={600}>{fmtCurrency(pricing.installment1Amount)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" display="block">Cuota 2 (en la jornada)</Typography>
                    <Typography variant="body2" fontWeight={600}>{fmtCurrency(pricing.installment2Amount)}</Typography>
                  </Grid>
                </Grid>
              </>
            )}

            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: `${COLOR_TOKENS.brand}15` }}>
              <Typography variant="caption" color="text.secondary" display="block">Total estimado (mínimo)</Typography>
              <Typography variant="h6" color="primary" fontWeight={700}>
                {fmtCurrency(pricing.totalAmount ?? 0)}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
