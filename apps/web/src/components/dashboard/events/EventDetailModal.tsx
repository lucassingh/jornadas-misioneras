'use client';

import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import { format, parseISO, differenceInDays, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  X, MapPin, Globe, Calendar, Clock, Users, Link2, Phone, Mail,
  User, Info, CreditCard, Building2, Image as ImageIcon,
} from 'lucide-react';
import { COLOR_TOKENS } from '@jornadas/ui';

interface EventDetail {
  id: number;
  title: string;
  imageUrl: string | null;
  imageUrl2: string | null;
  startDate: string | Date;
  endDate: string | Date;
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
  country: { name: string };
  province: { name: string; region: string | null };
  location: { name: string };
  pricing: {
    paymentSystem: string;
    registrationEarlyDeadline: string | Date;
    registrationEarlyAmount: unknown;
    registrationLateDeadline: string | Date;
    registrationLateAmount: unknown;
    eventPaymentDeadline: string | Date | null;
    eventPaymentEarlyAmount: unknown | null;
    eventPaymentAtEventAmount: unknown | null;
    installment1Deadline: string | Date | null;
    installment1Amount: unknown | null;
    installment2Amount: unknown | null;
    totalAmount: unknown | null;
  } | null;
}

interface Props {
  eventId: number | null;
  onClose: () => void;
}

const REGION_LABELS: Record<string, string> = {
  NOA: 'Noroeste (NOA)', NEA: 'Noreste (NEA)', CUYO: 'Cuyo',
  CENTRO: 'Centro', PAMPEANA: 'Pampeana',
  METROPOLITANA: 'Metropolitana (AMBA)', PATAGONIA: 'Patagonia',
};

const fmtDate = (d: string | Date | null | undefined) => {
  if (!d) return '—';
  const parsed = typeof d === 'string' ? parseISO(d) : d;
  return isValid(parsed) ? format(parsed, "d 'de' MMMM yyyy", { locale: es }) : '—';
};

const fmtAmount = (v: unknown) =>
  v != null ? Number(v).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }) : '—';

function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Box display="flex" alignItems="center" gap={1} mb={2}>
      <Box sx={{ color: COLOR_TOKENS.brand, display: 'flex' }}>{icon}</Box>
      <Typography variant="overline" fontWeight={700} color="text.secondary" lineHeight={1}>
        {label}
      </Typography>
    </Box>
  );
}

function TextBlock({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <Box mb={2}>
      <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
        {value}
      </Typography>
    </Box>
  );
}

function InfoChip({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
        borderRadius: 2, bgcolor: 'action.hover',
        border: '1px solid transparent',
        '&:hover': href ? { borderColor: 'divider', cursor: 'pointer' } : {},
      }}
    >
      <Box sx={{ color: COLOR_TOKENS.brand, flexShrink: 0, display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary" display="block" lineHeight={1}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={600}>{value}</Typography>
      </Box>
    </Box>
  );
  if (href) return <Box component="a" href={href} target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>{content}</Box>;
  return content;
}

function PricingRow({ label, date, amount }: { label: string; date?: string | Date | null; amount: unknown }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="baseline" py={0.75}>
      <Box>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        {date && <Typography variant="caption" color="text.disabled">{fmtDate(date)}</Typography>}
      </Box>
      <Typography variant="body2" fontWeight={700}>{fmtAmount(amount)}</Typography>
    </Box>
  );
}

export function EventDetailModal({ eventId, onClose }: Props) {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId) { setEvent(null); return; }
    setLoading(true);
    fetch(`/api/events/${eventId}`)
      .then((r) => r.json())
      .then((json: { data: EventDetail }) => setEvent(json.data))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [eventId]);

  const duration = event ? (() => {
    const s = typeof event.startDate === 'string' ? parseISO(event.startDate) : event.startDate;
    const e = typeof event.endDate === 'string' ? parseISO(event.endDate) : event.endDate;
    const d = differenceInDays(e, s);
    return d >= 0 ? d + 1 : null;
  })() : null;

  return (
    <Dialog
      open={eventId !== null}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
    >
      {/* ── Hero image / header ───────────────────────────────────────────── */}
      {loading ? (
        <Skeleton variant="rectangular" height={220} />
      ) : event?.imageUrl ? (
        <Box sx={{ position: 'relative', height: 220 }}>
          <Box
            component="img"
            src={event.imageUrl}
            alt={event.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <Box
            sx={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)',
              display: 'flex', alignItems: 'flex-end', p: 3,
            }}
          >
            <Box flex={1} minWidth={0}>
              <Typography variant="h5" fontWeight={800} color="#fff" noWrap>
                {event.title}
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.75)">
                {event.location.name}, {event.province.name}
              </Typography>
            </Box>
            <IconButton onClick={onClose} sx={{ color: '#fff', bgcolor: 'rgba(0,0,0,0.35)', ml: 1 }}>
              <X size={18} />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            background: `linear-gradient(135deg, ${COLOR_TOKENS.brand} 0%, ${COLOR_TOKENS.extra1} 100%)`,
            px: 3, pt: 3, pb: 2.5,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={800} color="#fff">
              {loading ? <Skeleton width={260} /> : (event?.title ?? '')}
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.75)" mt={0.5}>
              {event ? `${event.location.name}, ${event.province.name}` : ''}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: '#fff', bgcolor: 'rgba(0,0,0,0.2)', ml: 1 }}>
            <X size={18} />
          </IconButton>
        </Box>
      )}

      <DialogContent sx={{ p: 3 }}>
        {loading && (
          <Box>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={40} sx={{ mb: 1 }} />
            ))}
          </Box>
        )}

        {event && !loading && (
          <>
            {/* ── Dates ──────────────────────────────────────────────────── */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: `${COLOR_TOKENS.brand}12`, border: `1px solid ${COLOR_TOKENS.brand}25`, height: '100%' }}>
                  <Box display="flex" alignItems="center" gap={0.75} mb={0.5}>
                    <Calendar size={13} style={{ opacity: 0.6 }} />
                    <Typography variant="caption" color="text.secondary">Inicio</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={700}>{fmtDate(event.startDate)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: `${COLOR_TOKENS.extra1}12`, border: `1px solid ${COLOR_TOKENS.extra1}25`, height: '100%' }}>
                  <Box display="flex" alignItems="center" gap={0.75} mb={0.5}>
                    <Clock size={13} style={{ opacity: 0.6 }} />
                    <Typography variant="caption" color="text.secondary">Fin</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={700}>{fmtDate(event.endDate)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: `${COLOR_TOKENS.extra2}12`, border: `1px solid ${COLOR_TOKENS.extra2}25`, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="h4" fontWeight={800} color={COLOR_TOKENS.extra2} lineHeight={1}>
                    {duration ?? '—'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" mt={0.5}>
                    {duration === 1 ? 'día' : 'días'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* ── Location ───────────────────────────────────────────────── */}
            <Divider sx={{ mb: 2.5 }} />
            <SectionTitle icon={<MapPin size={16} />} label="Ubicación" />
            <Grid container spacing={1.5} mb={3}>
              <Grid item xs={12} sm={3}>
                <InfoChip icon={<Globe size={15} />} label="País" value={event.country.name} />
              </Grid>
              {event.province.region && (
                <Grid item xs={12} sm={3}>
                  <InfoChip icon={<MapPin size={15} />} label="Región" value={REGION_LABELS[event.province.region] ?? event.province.region} />
                </Grid>
              )}
              <Grid item xs={12} sm={event.province.region ? 3 : 4}>
                <InfoChip icon={<Building2 size={15} />} label="Provincia" value={event.province.name} />
              </Grid>
              <Grid item xs={12} sm={event.province.region ? 3 : 4}>
                <InfoChip icon={<MapPin size={15} />} label="Localidad" value={event.location.name} />
              </Grid>
            </Grid>

            {/* ── About ──────────────────────────────────────────────────── */}
            {(event.description || event.hostChurch || event.activities || event.extraInfo || event.targetAudience || event.capacity || event.registrationLink) && (
              <>
                <Divider sx={{ mb: 2.5 }} />
                <SectionTitle icon={<Info size={16} />} label="Sobre el evento" />
                <TextBlock label="Descripción" value={event.description} />
                <TextBlock label="Iglesia anfitriona" value={event.hostChurch} />
                <TextBlock label="Actividades" value={event.activities} />
                <TextBlock label="Información extra" value={event.extraInfo} />
                <TextBlock label="¿Quiénes pueden asistir?" value={event.targetAudience} />
                <Grid container spacing={2} mb={2}>
                  {event.capacity && (
                    <Grid item xs={12} sm={6}>
                      <InfoChip icon={<Users size={15} />} label="Cupos disponibles" value={String(event.capacity)} />
                    </Grid>
                  )}
                  {event.registrationLink && (
                    <Grid item xs={12} sm={6}>
                      <InfoChip icon={<Link2 size={15} />} label="Link de inscripción" value="Ver formulario" href={event.registrationLink} />
                    </Grid>
                  )}
                </Grid>
              </>
            )}

            {/* ── Images ─────────────────────────────────────────────────── */}
            {event.imageUrl2 && (
              <>
                <Divider sx={{ mb: 2.5 }} />
                <SectionTitle icon={<ImageIcon size={16} />} label="Imágenes" />
                <Grid container spacing={1.5} mb={3}>
                  {event.imageUrl && (
                    <Grid item xs={6}>
                      <Box component="img" src={event.imageUrl} alt="Principal"
                        sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 2 }} />
                      <Typography variant="caption" color="text.secondary">Principal</Typography>
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <Box component="img" src={event.imageUrl2} alt="Secundaria"
                      sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 2 }} />
                    <Typography variant="caption" color="text.secondary">Secundaria</Typography>
                  </Grid>
                </Grid>
              </>
            )}

            {/* ── Contact ────────────────────────────────────────────────── */}
            {(event.contactName || event.contactEmail || event.contactPhone) && (
              <>
                <Divider sx={{ mb: 2.5 }} />
                <SectionTitle icon={<User size={16} />} label="Contacto" />
                <Grid container spacing={1.5} mb={3}>
                  {event.contactName && (
                    <Grid item xs={12} sm={4}>
                      <InfoChip icon={<User size={15} />} label="Nombre" value={event.contactName} />
                    </Grid>
                  )}
                  {event.contactEmail && (
                    <Grid item xs={12} sm={4}>
                      <InfoChip icon={<Mail size={15} />} label="Email" value={event.contactEmail} href={`mailto:${event.contactEmail}`} />
                    </Grid>
                  )}
                  {event.contactPhone && (
                    <Grid item xs={12} sm={4}>
                      <InfoChip
                        icon={<Phone size={15} />} label="WhatsApp" value={event.contactPhone}
                        href={`https://wa.me/${event.contactPhone.replace(/[^\d]/g, '')}`}
                      />
                    </Grid>
                  )}
                </Grid>
              </>
            )}

            {/* ── Pricing ────────────────────────────────────────────────── */}
            {event.pricing && (
              <>
                <Divider sx={{ mb: 2.5 }} />
                <SectionTitle icon={<CreditCard size={16} />} label="Pagos y aranceles" />
                <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: 'action.hover', mb: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="overline" fontWeight={700} color="text.secondary" lineHeight={1}>
                      Inscripción
                    </Typography>
                    <Chip
                      label={event.pricing.paymentSystem === 'SYSTEM_ONE' ? 'Sistema 1' : 'Sistema 2 · Cuotas'}
                      size="small" variant="outlined" color="primary"
                    />
                  </Box>
                  <PricingRow label="Precio early" date={event.pricing.registrationEarlyDeadline} amount={event.pricing.registrationEarlyAmount} />
                  <Divider sx={{ my: 0.5, borderStyle: 'dashed' }} />
                  <PricingRow label="Precio normal" date={event.pricing.registrationLateDeadline} amount={event.pricing.registrationLateAmount} />
                </Box>

                {event.pricing.paymentSystem === 'SYSTEM_ONE' && (
                  <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: 'action.hover', mb: 2 }}>
                    <Typography variant="overline" fontWeight={700} color="text.secondary" display="block" lineHeight={1} mb={2}>
                      Pago del evento
                    </Typography>
                    <PricingRow label="Precio early" date={event.pricing.eventPaymentDeadline} amount={event.pricing.eventPaymentEarlyAmount} />
                    <Divider sx={{ my: 0.5, borderStyle: 'dashed' }} />
                    <PricingRow label="En la jornada" amount={event.pricing.eventPaymentAtEventAmount} />
                  </Box>
                )}

                {event.pricing.paymentSystem === 'SYSTEM_TWO' && (
                  <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: 'action.hover', mb: 2 }}>
                    <Typography variant="overline" fontWeight={700} color="text.secondary" display="block" lineHeight={1} mb={2}>
                      Cuotas del evento
                    </Typography>
                    <PricingRow label="Cuota 1" date={event.pricing.installment1Deadline} amount={event.pricing.installment1Amount} />
                    <Divider sx={{ my: 0.5, borderStyle: 'dashed' }} />
                    <PricingRow label="Cuota 2 (en jornada)" amount={event.pricing.installment2Amount} />
                  </Box>
                )}

                <Box sx={{ p: 2, borderRadius: 2, bgcolor: `${COLOR_TOKENS.brand}15`, border: `1px solid ${COLOR_TOKENS.brand}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Total estimado (mínimo)</Typography>
                  <Typography variant="h5" fontWeight={800} color="primary">
                    {fmtAmount(event.pricing.totalAmount)}
                  </Typography>
                </Box>
              </>
            )}

            {!event.pricing && (
              <>
                <Divider sx={{ mb: 2.5 }} />
                <Box display="flex" alignItems="center" gap={1}>
                  <CreditCard size={16} style={{ opacity: 0.4 }} />
                  <Chip label="Evento gratuito" color="success" variant="outlined" size="small" />
                </Box>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
