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
import Divider from '@mui/material/Divider';
import { Plus, Pencil, Trash2, MessageSquareQuote, Eye, AlignLeft, Calendar } from 'lucide-react';
import { CloudinaryUpload } from '../events/CloudinaryUpload';
import { ConfirmDialog, COLOR_TOKENS } from '@jornadas/ui';
import { Jumbotron } from '../Jumbotron';
import { PaginationBar } from '../PaginationBar';
import { TableSkeleton } from '../TableSkeleton';
import { DetailModal } from '../DetailModal';

interface TestimonialRow {
  id:        number;
  firstName: string;
  lastName:  string;
  avatarUrl: string | null;
  content:   string;
  eventName: string;
  createdAt: Date;
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
  testimonials: TestimonialRow[];
  page:         number;
  totalPages:   number;
  total:        number;
  pageSize:     number;
}

export function TestimonialsManager({ testimonials, page, totalPages, total, pageSize }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing,    setEditing]    = useState<TestimonialRow | null>(null);
  const [firstName,  setFirstName]  = useState('');
  const [lastName,   setLastName]   = useState('');
  const [avatarUrl,  setAvatarUrl]  = useState('');
  const [content,    setContent]    = useState('');
  const [eventName,  setEventName]  = useState('');
  const [deleteId,   setDeleteId]   = useState<number | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [viewItem,   setViewItem]   = useState<TestimonialRow | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFirstName('');
    setLastName('');
    setAvatarUrl('');
    setContent('');
    setEventName('');
    setDialogOpen(true);
  };

  const openEdit = (t: TestimonialRow) => {
    setEditing(t);
    setFirstName(t.firstName);
    setLastName(t.lastName);
    setAvatarUrl(t.avatarUrl ?? '');
    setContent(t.content);
    setEventName(t.eventName);
    setDialogOpen(true);
  };

  const isFormValid = firstName.trim().length >= 2 && lastName.trim().length >= 2
    && content.trim().length >= 10 && eventName.trim().length >= 2;

  const handleSave = async () => {
    if (!isFormValid) return;
    setLoading(true);
    const toastId = toast.loading(editing ? 'Actualizando...' : 'Creando...');
    try {
      const body: Record<string, unknown> = {
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        content:   content.trim(),
        eventName: eventName.trim(),
      };
      if (avatarUrl.trim()) body.avatarUrl = avatarUrl.trim();

      const res = await fetch(
        editing ? `/api/testimonials/${editing.id}` : '/api/testimonials',
        { method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
      );

      if (res.ok) {
        toast.success(editing ? 'Testimonio actualizado' : 'Testimonio creado', { id: toastId });
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
      const res = await fetch(`/api/testimonials/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Testimonio eliminado', { id: toastId });
        setDeleteId(null);
        startTransition(() => router.refresh());
      } else {
        const body = await res.json().catch(() => null);
        toast.error(body?.error ?? 'Error al eliminar', { id: toastId });
        setDeleteId(null);
      }
    } catch {
      toast.error('Error de conexión', { id: toastId });
    } finally { setLoading(false); }
  };

  return (
    <>
      <Jumbotron
        title="Testimonios"
        subtitle="Gestión de testimonios que aparecen en la landing"
        action={
          <Button variant="contained" color="secondary" startIcon={<Plus size={16} />} onClick={openCreate}>
            Nuevo Testimonio
          </Button>
        }
      />

      <Box sx={{ px: 3, pb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Persona</TableCell>
                <TableCell>Evento</TableCell>
                <TableCell>Testimonio</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isPending ? (
                <TableSkeleton
                  rows={Math.max(3, testimonials.length)}
                  columns={[
                    { type: 'avatar+text', width: 160 },
                    { type: 'text',        width: 140 },
                    { type: 'text',        width: 260 },
                    { type: 'actions',     align: 'right', actionCount: 3 },
                  ]}
                />
              ) : (
                <>
                  {testimonials.map((t) => (
                    <TableRow key={t.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            src={t.avatarUrl ?? undefined}
                            sx={{
                              width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700,
                              bgcolor: `${COLOR_TOKENS.extra2}22`,
                              color: COLOR_TOKENS.extra2,
                              border: `1px solid ${COLOR_TOKENS.extra2}33`,
                            }}
                          >
                            {t.firstName[0]}{t.lastName[0]}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600} variant="body2">
                              {t.firstName} {t.lastName}
                            </Typography>
                          </Box>
                        </Box>
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
                          <Typography variant="caption" fontWeight={600} sx={{ color: COLOR_TOKENS.brand }}>
                            {t.eventName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 320 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontStyle: 'italic',
                          }}
                        >
                          "{t.content}"
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75 }}>
                          <Tooltip title="Ver detalle">
                            <IconButton size="small" onClick={() => setViewItem(t)} sx={{ borderRadius: 1.5, ...ACTION_STYLES.view }}>
                              <Eye size={15} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => openEdit(t)} sx={{ borderRadius: 1.5, ...ACTION_STYLES.edit }}>
                              <Pencil size={15} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton size="small" onClick={() => setDeleteId(t.id)} sx={{ borderRadius: 1.5, ...ACTION_STYLES.delete }}>
                              <Trash2 size={15} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}

                  {testimonials.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                        <MessageSquareQuote size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                        <Typography color="text.secondary">No hay testimonios cargados</Typography>
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

      {/* ── Modal crear / editar ── */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar Testimonio' : 'Nuevo Testimonio'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              autoFocus
              label="Nombre"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <TextField
              label="Apellido"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Box>
          <TextField
            label="Evento al que asistió"
            fullWidth
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
            helperText="Ej: Jornada Misionera Córdoba 2024"
          />
          <TextField
            label="Testimonio"
            fullWidth
            multiline
            minRows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            helperText="El texto que se mostrará en la landing (máx. 2000 caracteres)"
            inputProps={{ maxLength: 2000 }}
          />
          <CloudinaryUpload
            label="Foto de perfil (opcional)"
            value={avatarUrl || null}
            onChange={(url) => setAvatarUrl(url ?? '')}
            folder="avatars"
          />
          {(firstName || lastName) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
              <Avatar
                src={avatarUrl || undefined}
                sx={{ width: 40, height: 40, bgcolor: `${COLOR_TOKENS.extra2}22`, color: COLOR_TOKENS.extra2 }}
              >
                {firstName[0]}{lastName[0]}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600}>{firstName} {lastName}</Typography>
                {eventName && (
                  <Typography variant="caption" color="text.secondary">{eventName}</Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={() => setDialogOpen(false)} variant="text">Cancelar</Button>
          <Button type="button" onClick={handleSave} variant="contained" disabled={loading || !isFormValid}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal detalle ── */}
      <DetailModal
        open={viewItem !== null}
        onClose={() => setViewItem(null)}
        title={viewItem ? `${viewItem.firstName} ${viewItem.lastName}` : ''}
        subtitle={viewItem?.eventName ?? ''}
        icon={<MessageSquareQuote size={22} />}
        iconBgColor={`${COLOR_TOKENS.extra2}15`}
        iconColor={COLOR_TOKENS.extra2}
        loading={false}
      >
        {viewItem && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                src={viewItem.avatarUrl ?? undefined}
                sx={{
                  width: 52, height: 52, fontSize: '1rem', fontWeight: 700,
                  bgcolor: `${COLOR_TOKENS.extra2}22`, color: COLOR_TOKENS.extra2,
                  border: `2px solid ${COLOR_TOKENS.extra2}33`,
                }}
              >
                {viewItem.firstName[0]}{viewItem.lastName[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  {viewItem.firstName} {viewItem.lastName}
                </Typography>
                <Box sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.75,
                  px: 1.25, py: 0.3, borderRadius: 1.5, mt: 0.5,
                  bgcolor: `${COLOR_TOKENS.brand}15`, border: `1px solid ${COLOR_TOKENS.brand}30`,
                }}>
                  <Calendar size={11} style={{ color: COLOR_TOKENS.brand }} />
                  <Typography variant="caption" fontWeight={600} sx={{ color: COLOR_TOKENS.brand }}>
                    {viewItem.eventName}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <AlignLeft size={15} style={{ opacity: 0.5, flexShrink: 0, marginTop: 2 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">Testimonio</Typography>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', mt: 0.5 }}
                >
                  "{viewItem.content}"
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </DetailModal>

      <ConfirmDialog
        open={deleteId !== null}
        title="Eliminar testimonio"
        description="¿Eliminar este testimonio? No se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={loading}
      />
    </>
  );
}
