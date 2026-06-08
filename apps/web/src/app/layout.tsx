import type { Metadata } from 'next';
import { Archivo_Black, Roboto_Flex } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from 'sonner';

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo-black',
  display: 'swap',
});

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  variable: '--font-roboto-flex',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Jornadas Misioneras', template: '%s | Jornadas Misioneras' },
  description: 'Plataforma de gestión de eventos misioneros',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${archivoBlack.variable} ${robotoFlex.variable}`} style={{ overflowAnchor: 'none' }}>
      <body>
        <Providers>{children}</Providers>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#2e2829',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
            },
          }}
        />
      </body>
    </html>
  );
}
