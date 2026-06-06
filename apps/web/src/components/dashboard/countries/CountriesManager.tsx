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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { Plus, Pencil, Trash2, Globe, Eye, Building2, Calendar } from 'lucide-react';
import { ConfirmDialog, COLOR_TOKENS } from '@jornadas/ui';
import { Jumbotron } from '../Jumbotron';
import { PaginationBar } from '../PaginationBar';
import { TableSkeleton } from '../TableSkeleton';
import { DetailModal } from '../DetailModal';

interface Country {
  id: number;
  name: string;
  _count: { provinces: number; events: number };
}

interface CountryDetail extends Country {
  provinces: { id: number; name: string; _count: { locations: number } }[];
}

function StatBadge({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 48 }}>
      <Typography variant="body2" fontWeight={700} sx={{ color, lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
        {label}
      </Typography>
    </Box>
  );
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
  countries: Country[];
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

export function CountriesManager({ countries, page, totalPages, total, pageSize }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Country | null>(null);
  const [name, setName] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewItem, setViewItem] = useState<CountryDetail | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const openCreate = () => { setEditing(null); setName(''); setDialogOpen(true); };
  const openEdit = (c: Country) => { setEditing(c); setName(c.name); setDialogOpen(true); };

  const openView = async (c: Country) => {
    setViewLoading(true);
    setViewItem({ ...c, provinces: [] });
    try {
      const res = await fetch(`/api/countries/${c.id}`);
      if (res.ok) {
        const json = await res.json() as { data: typeof viewItem };
        setViewItem(json.data);
      }
    } catch {
      // muestra datos básicos si falla el fetch
    } finally {
      setViewLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const toastId = toast.loading(editing ? 'Actualizando...' : 'Creando...');
    try {
      const res = await fetch(editing ? `/api/countries/${editing.id}` : '/api/countries', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        toast.success(editing ? 'País actualizado' : 'País creado', { id: toastId });
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
      const res = await fetch(`/api/countries/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('País eliminado', { id: toastId });
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
        title="Países"
        subtitle="Gestión de países disponibles en la plataforma"
        action={
          <Button variant="contained" color="secondary" startIcon={<Plus size={16} />} onClick={openCreate}>
            Nuevo País
          </Button>
        }
      />
      <Box sx={{ px: 3, pb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>País</TableCell>
                <TableCell align="center">Provincias</TableCell>
                <TableCell align="center">Eventos</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isPending ? (
                <TableSkeleton
                  rows={Math.max(3, countries.length)}
                  columns={[
                    { type: 'avatar+text', width: 140 },
                    { type: 'stat', align: 'center' },
                    { type: 'stat', align: 'center' },
                    { type: 'actions', align: 'right', actionCount: 3 },
                  ]}
                />
              ) : (
                <>
                  {countries.map((c) => (
                    <TableRow key={c.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 36, height: 36, fontSize: '0.85rem', fontWeight: 700,
                              bgcolor: `${COLOR_TOKENS.brand}22`,
                              color: COLOR_TOKENS.brand,
                              border: `1px solid ${COLOR_TOKENS.brand}33`,
                            }}
                          >
                            {c.name[0]}
                          </Avatar>
                          <Typography fontWeight={600}>{c.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <StatBadge value={c._count.provinces} label="prov." color={COLOR_TOKENS.extra2} />
                      </TableCell>
                      <TableCell align="center">
                        <StatBadge value={c._count.events} label="eventos" color={COLOR_TOKENS.extra1} />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75 }}>
                          <Tooltip title="Ver detalle">
                            <IconButton size="small" onClick={() => openView(c)} sx={{ borderRadius: 1.5, ...ACTION_STYLES.view }}>
                              <Eye size={15} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => openEdit(c)} sx={{ borderRadius: 1.5, ...ACTION_STYLES.edit }}>
                              <Pencil size={15} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton size="small" onClick={() => setDeleteId(c.id)} sx={{ borderRadius: 1.5, ...ACTION_STYLES.delete }}>
                              <Trash2 size={15} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {countries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                        <Globe size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                        <Typography color="text.secondary">No hay países cargados</Typography>
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
        <DialogTitle>{editing ? 'Editar País' : 'Nuevo País'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus label="Nombre del país" fullWidth value={name}
            onChange={(e) => setName(e.target.value)} sx={{ mt: 1 }}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} variant="text">Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading || !name.trim()}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal detalle */}
      <DetailModal
        open={viewItem !== null}
        onClose={() => setViewItem(null)}
        title={viewItem?.name ?? ''}
        subtitle={`${viewItem?._count.provinces ?? 0} provincias · ${viewItem?._count.events ?? 0} eventos`}
        icon={<Globe size={22} />}
        loading={viewLoading}
      >
        {viewItem && !viewLoading && (
          <>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  flex: 1, p: 2, borderRadius: 2,
                  bgcolor: `${COLOR_TOKENS.extra2}15`,
                  border: `1px solid ${COLOR_TOKENS.extra2}30`,
                }}
              >
                <Typography variant="h4" fontWeight={800} sx={{ color: COLOR_TOKENS.extra2, lineHeight: 1, mb: 0.5 }}>
                  {viewItem._count.provinces}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Building2 size={12} style={{ opacity: 0.6 }} />
                  <Typography variant="caption" color="text.secondary">Provincias</Typography>
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

            {viewItem.provinces.length > 0 && (
              <>
                <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1, letterSpacing: 1 }}>
                  Provincias ({viewItem.provinces.length})
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {viewItem.provinces.map((p) => (
                    <Box
                      key={p.id}
                      sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        px: 1.5, py: 0.875, borderRadius: 1.5,
                        bgcolor: 'action.hover',
                        border: '1px solid transparent',
                        '&:hover': { borderColor: 'divider' },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Building2 size={13} style={{ opacity: 0.45 }} />
                        <Typography variant="body2" fontWeight={500}>{p.name}</Typography>
                      </Box>
                      <Chip
                        label={`${p._count.locations} loc.`}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.65rem', borderRadius: 1 }}
                      />
                    </Box>
                  ))}
                </Box>
              </>
            )}

            {viewItem.provinces.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                <Building2 size={28} style={{ opacity: 0.25, marginBottom: 6 }} />
                <Typography variant="body2">Sin provincias asociadas</Typography>
              </Box>
            )}
          </>
        )}
      </DetailModal>

      <ConfirmDialog
        open={deleteId !== null} title="Eliminar país"
        description="¿Eliminar este país y todos sus datos asociados?"
        confirmLabel="Eliminar" onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)} loading={loading}
      />
    </>
  );
}
