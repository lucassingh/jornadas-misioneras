import { HeroLanding } from '@/components/landing/HeroLanding';
import { AboutLanding } from '@/components/landing/AboutLanding';
import { LocationsLanding } from '@/components/landing/LocationsLanding';
import { EventsLanding } from '@/components/landing/EventsLanding';
import { getPublicLocations } from '@/lib/queries/public-locations';
import { getPublicEvents } from '@/lib/queries/public-events';

export const revalidate = 3600;

export default async function HomePage() {
  const [locations, events] = await Promise.all([
    getPublicLocations(),
    getPublicEvents(),
  ]);

  return (
    <>
      <HeroLanding />
      <AboutLanding />
      <LocationsLanding locations={locations} />
      <EventsLanding events={events} />
    </>
  );
}
