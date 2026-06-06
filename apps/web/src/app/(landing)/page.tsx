import { HeroLanding } from '@/components/landing/HeroLanding';
import { AboutLanding } from '@/components/landing/AboutLanding';
import { LocationsLanding } from '@/components/landing/LocationsLanding';

export default function HomePage() {
  return (
    <>
      <HeroLanding />
      <AboutLanding />
      <LocationsLanding />
    </>
  );
}
