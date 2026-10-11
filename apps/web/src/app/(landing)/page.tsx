import { HeroLanding } from '@/components/landing/HeroLanding';
import { VideoLanding } from '@/components/landing/VideoLanding';
import { AboutLanding } from '@/components/landing/AboutLanding';
import { LocationsLanding } from '@/components/landing/LocationsLanding';
import { EventsLanding } from '@/components/landing/EventsLanding';
import { StatsLanding } from '@/components/landing/StatsLanding';
import { TestimonialsLanding } from '@/components/landing/TestimonialsLanding';
import { CTALanding } from '@/components/landing/CTALanding';
import { getPublicLocations } from '@/lib/queries/public-locations';
import { getPublicEvents } from '@/lib/queries/public-events';
import { getPublicTestimonials } from '@/lib/queries/public-testimonials';
import { getSiteContent } from '@/lib/queries/site-content';

export const revalidate = 3600;

export default async function HomePage() {
  const [locations, events, testimonials, content] = await Promise.all([
    getPublicLocations(),
    getPublicEvents(),
    getPublicTestimonials(),
    getSiteContent(),
  ]);

  return (
    <>
      <HeroLanding content={content.hero} />
      <VideoLanding content={content.video} />
      <AboutLanding content={content.about} />
      <LocationsLanding
        locations={locations}
        futureEventLocationIds={events.map(e => e.location.id)}
        content={content.locations}
      />
      <EventsLanding events={events} content={content.events} />
      <StatsLanding content={content.stats} />
      <TestimonialsLanding testimonials={testimonials} content={content.testimonials} />
      <CTALanding content={content.cta} />
    </>
  );
}
