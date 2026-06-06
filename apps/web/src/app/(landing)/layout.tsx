import { NavbarLanding } from '@/components/landing/NavbarLanding';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#0d0c0c', minHeight: '100dvh', color: '#f5f5f0' }}>
      <NavbarLanding />
      <main>{children}</main>
    </div>
  );
}
