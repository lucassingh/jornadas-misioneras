import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getPublicEvents, getPublicEventById, type PublicEventById } from '@/lib/queries/public-events';
import { getPublicTestimonials } from '@/lib/queries/public-testimonials';
import { EventDetailSlider } from '@/components/landing/EventDetailSlider';
import { TestimonialsLanding } from '@/components/landing/TestimonialsLanding';
import { CTALanding } from '@/components/landing/CTALanding';

export const revalidate = 3600;

export async function generateStaticParams() {
  const events = await getPublicEvents();
  return events.map((e) => ({ id: String(e.id) }));
}

interface Props {
  params: { id: string };
}

// ── Pricing helpers ────────────────────────────────────────────────────────────

type Pricing = NonNullable<PublicEventById['pricing']>;

function fmt(amount: Pricing['registrationEarlyAmount']) {
  return `$${Number(amount).toLocaleString('es-AR')}`;
}

function fmtDate(date: Date | null | undefined) {
  if (!date) return null;
  return format(new Date(date), "d 'de' MMMM yyyy", { locale: es });
}

function PricingSection({ pricing }: { pricing: Pricing }) {
  const isTwo = pricing.paymentSystem === 'SYSTEM_TWO';

  return (
    <div style={{ margin: '24px 0', padding: '20px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '8px' }}>
      <h2 style={{ marginTop: 0, marginBottom: '16px' }}>Pagos y Aranceles</h2>

      <div style={{ marginBottom: '16px' }}>
        <strong style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em', opacity: 0.6 }}>
          Inscripción
        </strong>
        <div style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed rgba(0,0,0,0.15)' }}>
            <div>
              <div>Precio early</div>
              {fmtDate(pricing.registrationEarlyDeadline) && (
                <div style={{ fontSize: '0.8rem', opacity: 0.55 }}>{fmtDate(pricing.registrationEarlyDeadline)}</div>
              )}
            </div>
            <strong>{fmt(pricing.registrationEarlyAmount)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <div>
              <div>Precio normal</div>
              {fmtDate(pricing.registrationLateDeadline) && (
                <div style={{ fontSize: '0.8rem', opacity: 0.55 }}>{fmtDate(pricing.registrationLateDeadline)}</div>
              )}
            </div>
            <strong>{fmt(pricing.registrationLateAmount)}</strong>
          </div>
        </div>
      </div>

      {isTwo ? (
        <div style={{ marginBottom: '16px' }}>
          <strong style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em', opacity: 0.6 }}>
            Cuotas del Evento
          </strong>
          <div style={{ marginTop: '8px' }}>
            {pricing.installment1Amount != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed rgba(0,0,0,0.15)' }}>
                <div>
                  <div>Cuota 1</div>
                  {fmtDate(pricing.installment1Deadline) && (
                    <div style={{ fontSize: '0.8rem', opacity: 0.55 }}>{fmtDate(pricing.installment1Deadline)}</div>
                  )}
                </div>
                <strong>{fmt(pricing.installment1Amount)}</strong>
              </div>
            )}
            {pricing.installment2Amount != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <div>Cuota 2 (en jornada)</div>
                <strong>{fmt(pricing.installment2Amount)}</strong>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: '16px' }}>
          <strong style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em', opacity: 0.6 }}>
            Pago del Evento
          </strong>
          <div style={{ marginTop: '8px' }}>
            {pricing.eventPaymentEarlyAmount != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed rgba(0,0,0,0.15)' }}>
                <div>
                  <div>Pago anticipado</div>
                  {fmtDate(pricing.eventPaymentDeadline) && (
                    <div style={{ fontSize: '0.8rem', opacity: 0.55 }}>{fmtDate(pricing.eventPaymentDeadline)}</div>
                  )}
                </div>
                <strong>{fmt(pricing.eventPaymentEarlyAmount)}</strong>
              </div>
            )}
            {pricing.eventPaymentAtEventAmount != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <div>Pago en jornada</div>
                <strong>{fmt(pricing.eventPaymentAtEventAmount)}</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {pricing.totalAmount != null && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid rgba(0,0,0,0.2)', marginTop: '8px' }}>
          <strong>Total estimado (mínimo)</strong>
          <strong style={{ fontSize: '1.1rem' }}>{fmt(pricing.totalAmount)}</strong>
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function EventDetailPage({ params }: Props) {
  const [event, testimonials] = await Promise.all([
    getPublicEventById(Number(params.id)),
    getPublicTestimonials(),
  ]);
  if (!event) notFound();

  const images = ([event.imageUrl, event.imageUrl2] as (string | null)[])
    .filter((s): s is string => Boolean(s));

  const startDate = format(new Date(event.startDate), "d 'de' MMMM yyyy", { locale: es });
  const endDate   = format(new Date(event.endDate),   "d 'de' MMMM yyyy", { locale: es });

  return (
    <>
      {/* ── Split layout ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>

        {/* Left — sticky full-height slider */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            width: '50%',
            height: '100vh',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <EventDetailSlider images={images} />
        </div>

        {/* Right — scrollable event info */}
        <div
          style={{
            width: '50%',
            minHeight: '100vh',
            background: '#f5f5f0',
            color: '#0d0c0c',
            padding: '48px 40px',
          }}
        >
          <h1>{event.title}</h1>

          <p><strong>Fecha:</strong> {startDate} – {endDate}</p>
          <p><strong>País:</strong> {event.country.name}</p>
          <p><strong>Provincia:</strong> {event.province.name}</p>
          <p><strong>Localidad:</strong> {event.location.name}</p>

          {event.description && (
            <div>
              <strong>Descripción:</strong>
              <div dangerouslySetInnerHTML={{ __html: event.description }} />
            </div>
          )}
          {event.hostChurch && (
            <div>
              <strong>Iglesia anfitriona:</strong>
              <div dangerouslySetInnerHTML={{ __html: event.hostChurch }} />
            </div>
          )}
          {event.activities && (
            <div>
              <strong>Actividades:</strong>
              <div dangerouslySetInnerHTML={{ __html: event.activities }} />
            </div>
          )}
          {event.targetAudience && (
            <div>
              <strong>Dirigido a:</strong>
              <div dangerouslySetInnerHTML={{ __html: event.targetAudience }} />
            </div>
          )}
          {event.extraInfo && (
            <div>
              <strong>Info adicional:</strong>
              <div dangerouslySetInnerHTML={{ __html: event.extraInfo }} />
            </div>
          )}
          {event.capacity && (
            <p><strong>Capacidad:</strong> {event.capacity} personas</p>
          )}

          {event.pricing && <PricingSection pricing={event.pricing} />}

          {event.registrationLink && (
            <p>
              <strong>Inscribirse:</strong>{' '}
              <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                {event.registrationLink}
              </a>
            </p>
          )}

          {(event.contactName || event.contactEmail || event.contactPhone) && (
            <div>
              <h2>Contacto</h2>
              {event.contactName  && <p><strong>Nombre:</strong> {event.contactName}</p>}
              {event.contactEmail && <p><strong>Email:</strong> {event.contactEmail}</p>}
              {event.contactPhone && <p><strong>Teléfono:</strong> {event.contactPhone}</p>}
            </div>
          )}
        </div>
      </div>

      {/* ── Post-scroll sections ──────────────────────────────────────────── */}
      <TestimonialsLanding testimonials={testimonials} />
      <CTALanding />
    </>
  );
}
