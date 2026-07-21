import { notFound } from 'next/navigation';
import { getPublicEvents, getPublicEventById } from '@/lib/queries/public-events';
import { getPublicTestimonials } from '@/lib/queries/public-testimonials';
import { EventDetailSlider } from '@/components/landing/EventDetailSlider';
import { EventDetailContent, type EventDetailProps } from '@/components/landing/EventDetailContent';
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

export default async function EventDetailPage({ params }: Props) {
  const [event, testimonials] = await Promise.all([
    getPublicEventById(Number(params.id)),
    getPublicTestimonials(),
  ]);
  if (!event) notFound();

  const images = ([event.imageUrl, event.imageUrl2] as (string | null)[])
    .filter((s): s is string => Boolean(s));

  // Convert Decimal → number and Date → ISO string before passing to client component
  const contentProps: EventDetailProps = {
    title:    event.title,
    country:  event.country.name,
    province: event.province.name,
    location: event.location.name,
    startDate: event.startDate.toISOString(),
    endDate:   event.endDate.toISOString(),
    capacity:         event.capacity,
    description:      event.description,
    hostChurch:       event.hostChurch,
    activities:       event.activities,
    targetAudience:   event.targetAudience,
    extraInfo:        event.extraInfo,
    registrationLink: event.registrationLink,
    contactName:      event.contactName,
    contactEmail:     event.contactEmail,
    contactPhone:     event.contactPhone,
    pricing: event.pricing ? {
      paymentSystem:               event.pricing.paymentSystem,
      registrationEarlyAmount:     Number(event.pricing.registrationEarlyAmount),
      registrationEarlyDeadline:   event.pricing.registrationEarlyDeadline?.toISOString() ?? null,
      registrationLateAmount:      Number(event.pricing.registrationLateAmount),
      registrationLateDeadline:    event.pricing.registrationLateDeadline?.toISOString() ?? null,
      eventPaymentEarlyAmount:     event.pricing.eventPaymentEarlyAmount    != null ? Number(event.pricing.eventPaymentEarlyAmount)    : null,
      eventPaymentDeadline:        event.pricing.eventPaymentDeadline?.toISOString()   ?? null,
      eventPaymentAtEventAmount:   event.pricing.eventPaymentAtEventAmount  != null ? Number(event.pricing.eventPaymentAtEventAmount)  : null,
      installment1Amount:          event.pricing.installment1Amount         != null ? Number(event.pricing.installment1Amount)         : null,
      installment1Deadline:        event.pricing.installment1Deadline?.toISOString()   ?? null,
      installment2Amount:          event.pricing.installment2Amount         != null ? Number(event.pricing.installment2Amount)         : null,
      totalAmount:                 event.pricing.totalAmount                != null ? Number(event.pricing.totalAmount)                : null,
    } : null,
  };

  return (
    <>
      {/* ── Split layout: sticky slider + scrollable content ─────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>

        {/* Left — sticky full-height image slider */}
        <div style={{
          position: 'sticky',
          top: 0,
          width: '50%',
          height: '100vh',
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          <EventDetailSlider images={images} />
        </div>

        {/* Right — scrollable event detail */}
        <div style={{ width: '50%', minHeight: '100vh' }}>
          <EventDetailContent {...contentProps} />
        </div>
      </div>

      {/* ── Post-scroll sections ──────────────────────────────────────────── */}
      <TestimonialsLanding testimonials={testimonials} />
      <CTALanding />
    </>
  );
}
