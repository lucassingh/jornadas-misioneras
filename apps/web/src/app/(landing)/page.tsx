import { HeroLanding } from '@/components/landing/HeroLanding';
import { AboutLanding } from '@/components/landing/AboutLanding';
import { LocationsLanding } from '@/components/landing/LocationsLanding';
import { EventsLanding } from '@/components/landing/EventsLanding';
import { StatsLanding } from '@/components/landing/StatsLanding';
import { TestimonialsLanding } from '@/components/landing/TestimonialsLanding';
import { CTALanding } from '@/components/landing/CTALanding';
import { getPublicLocations } from '@/lib/queries/public-locations';
import { getPublicEvents } from '@/lib/queries/public-events';
import { getPublicTestimonials } from '@/lib/queries/public-testimonials';

export const revalidate = 3600;

export default async function HomePage() {
  const [locations, events, testimonials] = await Promise.all([
    getPublicLocations(),
    getPublicEvents(),
    getPublicTestimonials(),
  ]);

  return (
    <>
      <HeroLanding />
      <AboutLanding />
      <LocationsLanding
        locations={locations}
        futureEventLocationIds={events.map(e => e.location.id)}
      />
      <EventsLanding events={events} />
      <StatsLanding />
      <TestimonialsLanding testimonials={testimonials} />
      <CTALanding />
    </>
  );
}
