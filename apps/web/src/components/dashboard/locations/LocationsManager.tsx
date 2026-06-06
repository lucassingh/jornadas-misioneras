'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { Plus, Pencil, Trash2, MapPin, Eye, Building2, Globe, Calendar, Tag, AlignLeft } from 'lucide-react';
import { ConfirmDialog, COLOR_TOKENS } from '@jornadas/ui';
import { Jumbotron } from '../Jumbotron';
import { PaginationBar } from '../PaginationBar';
import { TableSkeleton } from '../TableSkeleton';
import { DetailModal } from '../DetailModal';

interface Country { id: number; name: string }
interface Province { id: number; name: string; country: Country }
interface LocationRow {
  id: number;
  name: string;
  title?: string | null;
  description?: string | null;
  provinceId: number;
  province: Province;
  _count: { events: number };
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
  locations: LocationRow[];
  provinces: Province[];
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

export function LocationsManager({ locations, provinces, page, totalPages, total, pageSize }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LocationRow | null>(null);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [provinceId, setProvinceId] = useState<number | ''>('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewItem, setViewItem] = useState<LocationRow | null>(null);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setTitle('');
    setDescription('');
    setProvinceId('');
    setDialogOpen(true);
  };

  const openEdit = (l: LocationRow) => {
    setEditing(l);
    setName(l.name);
    setTitle(l.title ?? '');
    setDescription(l.description ?? '');
    setProvinceId(l.provinceId);
    setDialogOpen(true);
  };

  const openView = (l: LocationRow) => setViewItem(l);

  const handleSave = async () => {
    if (!name.trim() || !provinceId) return;
    setLoading(true);
    const toastId = toast.loading(editing ? 'Actualizando...' : 'Creando...');
    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
        provinceId: Number(provinceId),
      };
      if (title.trim()) body.title = title.trim();
      if (description.trim()) body.description = description.trim();

      const res = await fetch(editing ? `/api/locations/${editing.id}` : '/api/locations', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(editing ? 'Localidad actualizada' : 'Localidad creada', { id: toastId });
        setDialogOpen(false);
        startTransition(() => router.refresh());
      } else {
        toast.error('Error al guardar', { id: toastId });
      }
    } catch {
      toast.error('Error de conexión', { id: toastId });
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    const toastId = toast.loading('Eliminando...');
    try {
      const res = await fetch(`/api/locations/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Localidad eliminada', { id: toastId });
        setDeleteId(null);
        startTransition(() => router.refresh());
      } else {
        const body = await res.json().catch(() => null);
        const msg = body?.error ?? 'Error al eliminar';
        toast.error(msg, { id: toastId });
        setDeleteId(null);
      }
    } catch {
      toast.error('Error de conexión', { id: toastId });
    } finally { setLoading(false); }
  };

  return (
    <>
      <Jumbotron
        title="Localidades"
        subtitle="Gestión de localidades organizadas por provincia"
        action={
          <Button variant="contained" color="secondary" startIcon={<Plus size={16} />} onClick={openCreate}>
            Nueva Localidad
          </Button>
        }
      />
      <Box sx={{ px: 3, pb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Localidad</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Provincia</TableCell>
                <TableCell>País</TableCell>
                <TableCell align="center">Eventos</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isPending ? (
                <TableSkeleton
                  rows={Math.max(3, locations.length)}
                  columns={[
                    { type: 'avatar+text', width: 120 },
                    { type: 'text', width: 140 },
                    { type: 'text', width: 100 },
                    { type: 'badge', width: 80 },
                    { type: 'stat', align: 'center' },
                    { type: 'actions', align: 'right', actionCount: 3 },
                  ]}
                />
              ) : (
                <>
                  {locations.map((l) => (
                    <TableRow key={l.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 34, height: 34, fontSize: '0.8rem', fontWeight: 700,
                              bgcolor: `${COLOR_TOKENS.extra2}22`,
                              color: COLOR_TOKENS.extra2,
                              border: `1px solid ${COLOR_TOKENS.extra2}33`,
                            }}
                          >
                            {l.name[0]}
                          </Avatar>
                          <Typography fontWeight={600}>{l.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {l.title ? (
                          <Typography variant="body2" fontWeight={500}>{l.title}</Typography>
                        ) : (
                          <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>—</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{l.province.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-flex', alignItems: 'center', gap: 0.75,
                            px: 1.25, py: 0.4, borderRadius: 1.5,
                            bgcolor: `${COLOR_TOKENS.brand}15`,
                            border: `1px solid ${COLOR_TOKENS.brand}30`,
                          }}
                        >
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: COLOR_TOKENS.brand, flexShrink: 0 }} />
                          <Typography variant="caption" fontWeight={600} sx={{ color: COLOR_TOKENS.brand }}>
                            {l.province.country.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={700} sx={{ color: COLOR_TOKENS.extra1 }}>
                          {l._count.events}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75 }}>
                          <Tooltip title="Ver detalle">
                            <IconButton size="small" onClick={() => openView(l)} sx={{ borderRadius: 1.5, ...ACTION_STYLES.view }}>
                              <Eye size={15} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => openEdit(l)} sx={{ borderRadius: 1.5, ...ACTION_STYLES.edit }}>
                              <Pencil size={15} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton size="small" onClick={() => setDeleteId(l.id)} sx={{ borderRadius: 1.5, ...ACTION_STYLES.delete }}>
                              <Trash2 size={15} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {locations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <MapPin size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                        <Typography color="text.secondary">No hay localidades cargadas</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
          <PaginationBar page={page} totalPages={totalPages} total={total} pageSize={pageSize} />
        </TableContainer>
      </Box>

      {/* Modal crear/editar */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar Localidad' : 'Nueva Localidad'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          <TextField
            select
            label="Provincia"
            value={provinceId}
            onChange={(e) => setProvinceId(Number(e.target.value))}
            fullWidth
          >
            {provinces.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.name} ({p.country.name})</MenuItem>
            ))}
          </TextField>
          <TextField
            autoFocus
            label="Nombre"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            helperText="Nombre corto de la localidad (ciudad, sede, etc.)"
          />
          <TextField
            label="Título"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            helperText="Título descriptivo para mostrar en la landing (opcional)"
          />
          <TextField
            label="Descripción"
            fullWidth
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            helperText="Descripción pública de la localidad (opcional)"
          />
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={() => setDialogOpen(false)} variant="text">Cancelar</Button>
          <Button type="button" onClick={handleSave} variant="contained" disabled={loading || !name.trim() || !provinceId}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal detalle */}
      <DetailModal
        open={viewItem !== null}
        onClose={() => setViewItem(null)}
        title={viewItem?.name ?? ''}
        subtitle={viewItem ? `${viewItem.province.name}, ${viewItem.province.country.name}` : ''}
        icon={<MapPin size={22} />}
        iconBgColor={`${COLOR_TOKENS.extra2}15`}
        iconColor={COLOR_TOKENS.extra2}
        loading={false}
      >
        {viewItem && (
          <>
            {/* Jerarquía */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                <Building2 size={15} style={{ opacity: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Provincia</Typography>
                  <Typography variant="body2" fontWeight={600}>{viewItem.province.name}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                <Globe size={15} style={{ opacity: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">País</Typography>
                  <Typography variant="body2" fontWeight={600}>{viewItem.province.country.name}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Título y descripción */}
            {(viewItem.title || viewItem.description) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {viewItem.title && (
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Tag size={15} style={{ opacity: 0.5, flexShrink: 0, marginTop: 2 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Título</Typography>
                        <Typography variant="body2" fontWeight={600}>{viewItem.title}</Typography>
                      </Box>
                    </Box>
                  )}
                  {viewItem.description && (
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <AlignLeft size={15} style={{ opacity: 0.5, flexShrink: 0, marginTop: 2 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Descripción</Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{viewItem.description}</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Stat eventos */}
            <Box
              sx={{
                p: 2, borderRadius: 2,
                bgcolor: `${COLOR_TOKENS.extra1}15`,
                border: `1px solid ${COLOR_TOKENS.extra1}30`,
                display: 'flex', alignItems: 'center', gap: 2,
              }}
            >
              <Typography variant="h4" fontWeight={800} sx={{ color: COLOR_TOKENS.extra1, lineHeight: 1 }}>
                {viewItem._count.events}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Calendar size={14} style={{ opacity: 0.6 }} />
                <Typography variant="body2" color="text.secondary">Eventos asociados</Typography>
              </Box>
            </Box>
          </>
        )}
      </DetailModal>

      <ConfirmDialog open={deleteId !== null} title="Eliminar localidad"
        description="¿Eliminar esta localidad?" confirmLabel="Eliminar"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={loading} />
    </>
  );
}
