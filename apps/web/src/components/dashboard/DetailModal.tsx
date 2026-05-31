'use client';

import { type ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import { X } from 'lucide-react';
import { COLOR_TOKENS } from '@jornadas/ui';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  children?: ReactNode;
  loading?: boolean;
}

export function DetailModal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  iconBgColor = `${COLOR_TOKENS.brand}15`,
  iconColor = COLOR_TOKENS.brand,
  children,
  loading = false,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: iconBgColor,
                color: iconColor,
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} lineHeight={1.3}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ mt: -0.25, flexShrink: 0 }}>
            <X size={16} />
          </IconButton>
        </Box>
        <Divider sx={{ mt: 1.5 }} />
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="rounded" height={80} sx={{ flex: 1, borderRadius: 2 }} />
              <Skeleton variant="rounded" height={80} sx={{ flex: 1, borderRadius: 2 }} />
            </Box>
            <Skeleton variant="rounded" height={24} width={100} sx={{ borderRadius: 1, mt: 1 }} />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={44} sx={{ borderRadius: 1.5 }} />
            ))}
          </Box>
        ) : (
          children
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" size="small">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
