import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { COLOR_TOKENS } from '@jornadas/ui';

interface JumbotronProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Jumbotron({ title, subtitle, action }: JumbotronProps) {
  return (
    <Box
      sx={{
        width: '100%',
        px: 4,
        pt: 1.75,
        pb: 2,
        mb: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
        position: 'relative',

        // Gradient animado entre extra1 y extra2
        background: `linear-gradient(
          -45deg,
          ${COLOR_TOKENS.brand},
          #0f1a8c,
          ${COLOR_TOKENS.brand},
          #0a1266
        )`,
        backgroundSize: '300% 300%',

        '@keyframes gradientShift': {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        animation: 'gradientShift 25s ease infinite',

        // Borde sutil de extra2 abajo
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${COLOR_TOKENS.extra2}55, transparent)`,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h5"
          sx={{ color: '#fff', fontFamily: 'var(--font-archivo-black)', fontWeight: 400, lineHeight: 1.2 }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', mt: 0.25, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && (
        <Box sx={{ flexShrink: 0, ml: 3, position: 'relative', zIndex: 1 }}>
          {action}
        </Box>
      )}
    </Box>
  );
}
