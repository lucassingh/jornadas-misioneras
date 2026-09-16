import Box from '@mui/material/Box';
import Image from 'next/image';
import { MapPin, MessageSquareQuote, CalendarPlus } from 'lucide-react';

const FG = '#f5f5f0';
const FONT_DISPLAY = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_BODY = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';

const CAPABILITIES = [
  {
    icon: MapPin,
    title: 'Agregar países, provincias y localidades',
    body: 'Sumá nuevos países, provincias y ciudades para organizar los eventos.',
  },
  {
    icon: MessageSquareQuote,
    title: 'Agregar testimonios',
    body: 'Compartí las historias de quienes ya vivieron una Jornada.',
  },
  {
    icon: CalendarPlus,
    title: 'Crear eventos',
    body: 'Publicá las próximas Jornadas Misioneras para que la comunidad se sume.',
  },
] as const;

export function AuthSplitLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh' }}>
      {/* ── 70% — gradiente animado + explicación ── */}
      <Box
        sx={{
          position: 'relative',
          width: { xs: '100%', md: '70%' },
          minHeight: { xs: '260px', md: '100vh' },
          overflow: 'hidden',
          background:
            'linear-gradient(-45deg, #1a29c9 0%, #2235fd 25%, #4d5dff 45%, #2235fd 65%, #84f649 82%, #1a29c9 100%)',
          backgroundSize: '400% 400%',
          animation: 'jmAuthGradient 12s ease infinite',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: '28px', sm: '56px', md: '72px', xl: '96px' },
          py: { xs: '48px', md: '0' },
        }}
      >
        {/* Velo para asentar el contraste del texto sobre el gradiente */}
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(13,12,12,0.18)' }} />

        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '840px' }}>
          <Box
            component="h1"
            sx={{
              m: 0,
              fontFamily: FONT_DISPLAY,
              fontWeight: 400,
              color: FG,
              fontSize: { xs: '9vw', sm: '6.2vw', md: '4.2vw', lg: '3.6vw', xl: '3.3vw' },
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
            }}
          >
            Dashboard administrativo
            <br />
            de Jornadas Misioneras
          </Box>

          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              mt: '20px',
              fontFamily: FONT_BODY,
              fontSize: '15px',
              color: FG,
              opacity: 0.82,
              lineHeight: 1.6,
              maxWidth: '440px',
            }}
          >
            Desde acá gestionás todo lo necesario para organizar las próximas Jornadas.
          </Box>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              gap: '20px',
              mt: '40px',
              p: '24px',
              borderRadius: '16px',
              backgroundColor: 'rgba(13,12,12,0.22)',
            }}
          >
            {CAPABILITIES.map(({ icon: Icon, title, body }) => (
              <Box key={title} sx={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <Box
                  sx={{
                    flexShrink: 0,
                    width: '34px',
                    height: '34px',
                    borderRadius: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(245,245,240,0.14)',
                    color: FG,
                  }}
                >
                  <Icon size={18} />
                </Box>
                <Box>
                  <Box sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: '14.5px', color: FG }}>
                    {title}
                  </Box>
                  <Box sx={{ fontFamily: FONT_BODY, fontSize: '13px', color: FG, opacity: 0.78, mt: '3px', lineHeight: 1.5 }}>
                    {body}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <style>{`
          @keyframes jmAuthGradient {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </Box>

      {/* ── 30% — logo + form de Clerk ── */}
      <Box
        sx={{
          width: { xs: '100%', md: '30%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          px: { xs: '24px', md: '32px' },
          py: { xs: '40px', md: '0' },
        }}
      >
        <Box sx={{ position: 'relative', width: 160, height: 46, mb: { xs: '28px', md: '36px' } }}>
          <Image
            src="/logos/logo_JM_bg_light_op2.svg"
            alt="Jornadas Misioneras"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>

        {children}
      </Box>
    </Box>
  );
}
