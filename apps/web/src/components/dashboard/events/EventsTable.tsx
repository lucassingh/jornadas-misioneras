'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { Pencil, Trash2, Eye, Calendar, MapPin, Building2, Globe, Clock } from 'lucide-react';
import { ConfirmDialog, COLOR_TOKENS } from '@jornadas/ui';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { PaginationBar } from '../PaginationBar';
import { TableSkeleton } from '../TableSkeleton';
import { DetailModal } from '../DetailModal';

interface EventRow {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  createdBy: string;
  country: { name: string };
  province: { name: string };
  location: { name: string };
}

const ACTION_STYLES = {
  view: {
    bgcolor: `${COLOR_TOKENS.brand}12`,
    color: COLOR_TOKENS.brand,
    '&:hover': { bgcolor: `${COLOR_TOKENS.brand}28` },
  },
  edit: {
    bgcolor: 'rgba(245,158,11,0.12)',
    color: '#f59e0b',
    '&:hover': { bgcolor: 'rgba(245,158,11,0.24)' },
  },
  delete: {
    bgcolor: 'rgba(244,67,54,0.10)',
    color: '#f44336',
    '&:hover': { bgcolor: 'rgba(244,67,54,0.22)' },
  },
} as const;

interface Props {
  events: EventRow[];
  currentUserId: string;
  isAdmin: boolean;
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
        borderRadius: 1.5, bgcolor: 'action.hover',
      }}
    >
      <Box sx={{ color: 'text.secondary', flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={600}>{value}</Typography>
      </Box>
    </Box>
  );
}

export function EventsTable({ events, currentUserId, isAdmin, page, totalPages, total, pageSize }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewItem, setViewItem] = useState<EventRow | null>(null);

  const canEdit = (e: EventRow) => isAdmin || e.createdBy === currentUserId;

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    const toastId = toast.loading('Eliminando evento...');
    try {
      const res = await fetch(`/api/events/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Evento eliminado', { id: toastId });
        startTransition(() => router.refresh());
      } else {
        toast.error('Error al eliminar', { id: toastId });
      }
    } catch {
      toast.error('Error de conexión', { id: toastId });
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  if (events.length === 0 && !isPending) {
    return (
      <>
        <Box textAlign="center" py={10}>
          <Calendar size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
          <Typography color="text.secondary">No hay eventos todavía. ¡Creá el primero!</Typography>
        </Box>
        <PaginationBar page={page} totalPages={totalPages} total={total} pageSize={pageSize} />
      </>
    );
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Evento</TableCell>
              <TableCell>País</TableCell>
              <TableCell>Localidad</TableCell>
              <TableCell>Inicio</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isPending ? (
              <TableSkeleton
                rows={Math.max(3, events.length)}
                columns={[
                  { type: 'multiline', width: 150 },
                  { type: 'chip', width: 80 },
                  { type: 'text', width: 100 },
                  { type: 'text', width: 80 },
                  { type: 'text', width: 80 },
                  { type: 'actions', align: 'right', actionCount: 3 },
                ]}
              />
            ) : (
              events.map((event) => (
                <TableRow key={event.id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{event.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {event.location.name}, {event.province.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={event.country.name} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{event.location.name}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(event.startDate), 'd MMM yyyy', { locale: es })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(event.endDate), 'd MMM yyyy', { locale: es })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75 }}>
                      <Tooltip title="Ver detalle">
                        <IconButton size="small" onClick={() => setViewItem(event)} sx={{ borderRadius: 1.5, ...ACTION_STYLES.view }}>
                          <Eye size={15} />
                        </IconButton>
                      </Tooltip>
                      {canEdit(event) && (
                        <>
                          <Tooltip title="Editar">
                            <IconButton component={Link} href={`/dashboard/events/${event.id}/edit`} size="small" sx={{ borderRadius: 1.5, ...ACTION_STYLES.edit }}>
                              <Pencil size={15} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton size="small" onClick={() => setDeleteId(event.id)} sx={{ borderRadius: 1.5, ...ACTION_STYLES.delete }}>
                              <Trash2 size={15} />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <PaginationBar page={page} totalPages={totalPages} total={total} pageSize={pageSize} />
      </TableContainer>

      {/* Modal detalle */}
      <DetailModal
        open={viewItem !== null}
        onClose={() => setViewItem(null)}
        title={viewItem?.title ?? ''}
        subtitle={viewItem ? `${viewItem.location.name}, ${viewItem.province.name}` : ''}
        icon={<Calendar size={22} />}
        iconBgColor={`${COLOR_TOKENS.extra1}15`}
        iconColor={COLOR_TOKENS.extra1}
        loading={false}
      >
        {viewItem && (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box
                  sx={{
                    flex: 1, p: 1.75, borderRadius: 2,
                    bgcolor: `${COLOR_TOKENS.brand}10`,
                    border: `1px solid ${COLOR_TOKENS.brand}25`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                    <Clock size={12} style={{ opacity: 0.55 }} />
                    <Typography variant="caption" color="text.secondary">Inicio</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={700}>
                    {format(new Date(viewItem.startDate), "d MMM yyyy", { locale: es })}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1, p: 1.75, borderRadius: 2,
                    bgcolor: `${COLOR_TOKENS.extra1}10`,
                    border: `1px solid ${COLOR_TOKENS.extra1}25`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                    <Clock size={12} style={{ opacity: 0.55 }} />
                    <Typography variant="caption" color="text.secondary">Fin</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={700}>
                    {format(new Date(viewItem.endDate), "d MMM yyyy", { locale: es })}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InfoRow icon={<MapPin size={15} />} label="Localidad" value={viewItem.location.name} />
              <InfoRow icon={<Building2 size={15} />} label="Provincia" value={viewItem.province.name} />
              <InfoRow icon={<Globe size={15} />} label="País" value={viewItem.country.name} />
            </Box>
          </>
        )}
      </DetailModal>

      <ConfirmDialog
        open={deleteId !== null}
        title="Eliminar evento"
        description="¿Eliminar este evento? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={loading}
      />
    </>
  );
}
