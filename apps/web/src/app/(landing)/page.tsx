import { HeroLanding } from '@/components/landing/HeroLanding';
import { AboutLanding } from '@/components/landing/AboutLanding';
import { LocationsLanding } from '@/components/landing/LocationsLanding';
import { getPublicLocations } from '@/lib/queries/public-locations';

export const revalidate = 3600;

export default async function HomePage() {
  const locations = await getPublicLocations();

  return (
    <>
      <HeroLanding />
      <AboutLanding />
      <LocationsLanding locations={locations} />
    </>
  );
}
