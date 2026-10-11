import { notFound } from 'next/navigation';
import { getPublicEvents, getPublicEventById } from '@/lib/queries/public-events';
import { getPublicTestimonials } from '@/lib/queries/public-testimonials';
import { getSiteContent } from '@/lib/queries/site-content';
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
  const [event, testimonials, content] = await Promise.all([
    getPublicEventById(Number(params.id)),
    getPublicTestimonials(),
    getSiteContent(),
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
    pricing: event.pricing
      ? {
          priceTwoMonthsBefore: Number(event.pricing.priceTwoMonthsBefore),
          priceOneMonthBefore:  Number(event.pricing.priceOneMonthBefore),
        }
      : null,
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
          <EventDetailContent {...contentProps} content={content.eventDetail} />
        </div>
      </div>

      {/* ── Post-scroll sections ──────────────────────────────────────────── */}
      <TestimonialsLanding testimonials={testimonials} content={content.testimonials} />
      <CTALanding content={content.cta} />
    </>
  );
}
