import type { Metadata } from 'next';
import { NavbarLanding } from '@/components/landing/NavbarLanding';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { PageLoader } from '@/components/landing/PageLoader';
import { SocialRail } from '@/components/landing/SocialRail';
import { getSiteContent } from '@/lib/queries/site-content';

// Mismo ISR que las páginas: navbar, footer y botones flotantes leen el CMS
// (contacto y redes), y el dashboard invalida este layout al guardar.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent();
  return {
    title: { default: seo.siteTitle, template: `%s | ${seo.siteTitle}` },
    description: seo.siteDescription,
    openGraph: {
      title: seo.siteTitle,
      description: seo.siteDescription,
      siteName: seo.siteTitle,
      locale: 'es_AR',
      type: 'website',
    },
  };
}

export default async function LandingLayout({ children }: { children: React.ReactNode }) {
  const { contact, footer } = await getSiteContent();

  return (
    <div style={{ backgroundColor: '#0d0c0c', minHeight: '100dvh', color: '#f5f5f0' }}>
      <PageLoader />
      <NavbarLanding contact={contact} />
      <SocialRail contact={contact} />
      <main>{children}</main>
      <LandingFooter content={footer} contact={contact} />
    </div>
  );
}
