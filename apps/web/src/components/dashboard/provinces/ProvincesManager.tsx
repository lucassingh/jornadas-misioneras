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
import Chip from '@mui/material/Chip';
import { Plus, Pencil, Trash2, Building2, Eye, MapPin, Calendar, Globe } from 'lucide-react';
import { ConfirmDialog, COLOR_TOKENS } from '@jornadas/ui';
import { Jumbotron } from '../Jumbotron';
import { PaginationBar } from '../PaginationBar';
import { TableSkeleton } from '../TableSkeleton';
import { DetailModal } from '../DetailModal';

interface Country { id: number; name: string }
interface Province {
  id: number; name: string; countryId: number; region: string | null;
  country: Country;
  _count: { locations: number; events: number };
}

interface ProvinceDetail extends Province {
  locations: { id: number; name: string; _count: { events: number } }[];
}

const COUNTRY_COLORS = [
  '#2235fd', '#ff3e60', '#90b8f6', '#efdfb4', '#7c3aed', '#059669', '#d97706',
];

function countryColor(id: number) {
  return COUNTRY_COLORS[id % COUNTRY_COLORS.length];
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
  provinces: Province[];
  countries: Country[];
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

export function ProvincesManager({ provinces, countries, page, totalPages, total, pageSize }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Province | null>(null);
  const [name, setName] = useState('');
  const [countryId, setCountryId] = useState<number | ''>('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [region, setRegion] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [viewItem, setViewItem] = useState<ProvinceDetail | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const argentinaId = countries.find((c) => c.name === 'Argentina')?.id;
  const isArgentina = countryId !== '' && countryId === argentinaId;

  const openCreate = () => { setEditing(null); setName(''); setCountryId(''); setRegion(''); setDialogOpen(true); };
  const openEdit = (p: Province) => { setEditing(p); setName(p.name); setCountryId(p.countryId); setRegion(p.region ?? ''); setDialogOpen(true); };

  const openView = async (p: Province) => {
    setViewLoading(true);
    setViewItem({ ...p, locations: [] });
    try {
      const res = await fetch(`/api/provinces/${p.id}`);
      if (res.ok) {
        const json = await res.json() as { data: typeof viewItem };
        setViewItem(json.data);
      }
    } catch {
      // muestra datos básicos si falla
    } finally {
      setViewLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !countryId) return;
    setLoading(true);
    const toastId = toast.loading(editing ? 'Actualizando...' : 'Creando...');
    try {
      const res = await fetch(editing ? `/api/provinces/${editing.id}` : '/api/provinces', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), countryId: Number(countryId), region: region || null }),
      });
      if (res.ok) {
        toast.success(editing ? 'Provincia actualizada' : 'Provincia creada', { id: toastId });
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
      const res = await fetch(`/api/provinces/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Provincia eliminada', { id: toastId });
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
        title="Provincias"
        subtitle="Gestión de provincias organizadas por país"
        action={
          <Button variant="contained" color="secondary" startIcon={<Plus size={16} />} onClick={openCreate}>
            Nueva Provincia
          </Button>
        }
      />
      <Box sx={{ px: 3, pb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Provincia</TableCell>
                <TableCell>País</TableCell>
                <TableCell align="center">Localidades</TableCell>
                <TableCell align="center">Eventos</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isPending ? (
                <TableSkeleton
                  rows={Math.max(3, provinces.length)}
                  columns={[
                    { type: 'avatar+text', width: 130 },
                    { type: 'badge', width: 90 },
                    { type: 'stat', align: 'center' },
                    { type: 'stat', align: 'center' },
                    { type: 'actions', align: 'right', actionCount: 3 },
                  ]}
                />
              ) : (
                <>
                  {provinces.map((p) => {
                    const color = countryColor(p.countryId);
                    return (
                      <TableRow key={p.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              sx={{
                                width: 34, height: 34, fontSize: '0.8rem', fontWeight: 700,
                                bgcolor: `${color}22`, color, border: `1px solid ${color}33`,
                              }}
                            >
                              {p.name[0]}
                            </Avatar>
                            <Typography fontWeight={600}>{p.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-flex', alignItems: 'center', gap: 0.75,
                              px: 1.25, py: 0.4, borderRadius: 1.5,
                              bgcolor: `${color}15`, border: `1px solid ${color}30`,
                            }}
                          >
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
                            <Typography variant="caption" fontWeight={600} sx={{ color }}>
                              {p.country.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight={700} sx={{ color: COLOR_TOKENS.extra2 }}>
                            {p._count.locations}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight={700} sx={{ color: COLOR_TOKENS.extra1 }}>
                            {p._count.events}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75 }}>
                            <Tooltip title="Ver detalle">
                              <IconButton size="small" onClick={() => openView(p)} sx={{ borderRadius: 1.5, ...ACTION_STYLES.view }}>
                                <Eye size={15} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton size="small" onClick={() => openEdit(p)} sx={{ borderRadius: 1.5, ...ACTION_STYLES.edit }}>
                                <Pencil size={15} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton size="small" onClick={() => setDeleteId(p.id)} sx={{ borderRadius: 1.5, ...ACTION_STYLES.delete }}>
                                <Trash2 size={15} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {provinces.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Building2 size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                        <Typography color="text.secondary">No hay provincias cargadas</Typography>
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
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editing ? 'Editar Provincia' : 'Nueva Provincia'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          <TextField
            select label="País" fullWidth value={countryId}
            onChange={(e) => { setCountryId(Number(e.target.value)); setRegion(''); }}
          >
            {countries.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </TextField>

          <TextField autoFocus label="Nombre" fullWidth value={name} onChange={(e) => setName(e.target.value)} />

          {isArgentina && (
            <TextField
              select label="Región" fullWidth value={region}
              onChange={(e) => setRegion(e.target.value)}
              helperText="Requerido para que aparezca en el filtro de región del formulario de evento"
            >
              <MenuItem value="">Sin asignar</MenuItem>
              <MenuItem value="NOA">Noroeste (NOA)</MenuItem>
              <MenuItem value="NEA">Noreste (NEA)</MenuItem>
              <MenuItem value="CUYO">Cuyo</MenuItem>
              <MenuItem value="CENTRO">Centro</MenuItem>
              <MenuItem value="PAMPEANA">Pampeana</MenuItem>
              <MenuItem value="METROPOLITANA">Metropolitana (AMBA)</MenuItem>
              <MenuItem value="PATAGONIA">Patagonia</MenuItem>
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} variant="text">Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading || !name.trim() || !countryId}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal detalle */}
      <DetailModal
        open={viewItem !== null}
        onClose={() => setViewItem(null)}
        title={viewItem?.name ?? ''}
        subtitle={viewItem ? `${viewItem.country.name} · ${viewItem._count.locations} localidades` : ''}
        icon={<Building2 size={22} />}
        iconBgColor={viewItem ? `${countryColor(viewItem.countryId)}15` : undefined}
        iconColor={viewItem ? countryColor(viewItem.countryId) : undefined}
        loading={viewLoading}
      >
        {viewItem && !viewLoading && (
          <>
            {/* País */}
            <Box
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
                borderRadius: 2, bgcolor: 'action.hover', mb: 2.5,
              }}
            >
              <Globe size={16} style={{ opacity: 0.5 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">País</Typography>
                <Typography variant="body2" fontWeight={600}>{viewItem.country.name}</Typography>
              </Box>
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  flex: 1, p: 2, borderRadius: 2,
                  bgcolor: `${COLOR_TOKENS.extra2}15`,
                  border: `1px solid ${COLOR_TOKENS.extra2}30`,
                }}
              >
                <Typography variant="h4" fontWeight={800} sx={{ color: COLOR_TOKENS.extra2, lineHeight: 1, mb: 0.5 }}>
                  {viewItem._count.locations}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <MapPin size={12} style={{ opacity: 0.6 }} />
                  <Typography variant="caption" color="text.secondary">Localidades</Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 1, p: 2, borderRadius: 2,
                  bgcolor: `${COLOR_TOKENS.extra1}15`,
                  border: `1px solid ${COLOR_TOKENS.extra1}30`,
                }}
              >
                <Typography variant="h4" fontWeight={800} sx={{ color: COLOR_TOKENS.extra1, lineHeight: 1, mb: 0.5 }}>
                  {viewItem._count.events}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Calendar size={12} style={{ opacity: 0.6 }} />
                  <Typography variant="caption" color="text.secondary">Eventos</Typography>
                </Box>
              </Box>
            </Box>

            {/* Localidades */}
            {viewItem.locations.length > 0 && (
              <>
                <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1, letterSpacing: 1 }}>
                  Localidades ({viewItem.locations.length})
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {viewItem.locations.map((l) => (
                    <Box
                      key={l.id}
                      sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        px: 1.5, py: 0.875, borderRadius: 1.5,
                        bgcolor: 'action.hover',
                        border: '1px solid transparent',
                        '&:hover': { borderColor: 'divider' },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MapPin size={13} style={{ opacity: 0.45 }} />
                        <Typography variant="body2" fontWeight={500}>{l.name}</Typography>
                      </Box>
                      <Chip
                        label={`${l._count.events} ev.`}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.65rem', borderRadius: 1 }}
                      />
                    </Box>
                  ))}
                </Box>
              </>
            )}

            {viewItem.locations.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                <MapPin size={28} style={{ opacity: 0.25, marginBottom: 6 }} />
                <Typography variant="body2">Sin localidades asociadas</Typography>
              </Box>
            )}
          </>
        )}
      </DetailModal>

      <ConfirmDialog open={deleteId !== null} title="Eliminar provincia"
        description="¿Eliminar esta provincia y sus localidades?" confirmLabel="Eliminar"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={loading} />
    </>
  );
}
