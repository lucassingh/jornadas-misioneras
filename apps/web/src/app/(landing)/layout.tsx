import { NavbarLanding } from '@/components/landing/NavbarLanding';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { PageLoader } from '@/components/landing/PageLoader';
import { SocialRail } from '@/components/landing/SocialRail';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#0d0c0c', minHeight: '100dvh', color: '#f5f5f0' }}>
      <PageLoader />
      <NavbarLanding />
      <SocialRail />
      <main>{children}</main>
      <LandingFooter />
    </div>
  );
}
