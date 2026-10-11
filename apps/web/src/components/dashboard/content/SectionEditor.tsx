'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { RotateCcw, Save, ExternalLink, History } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ConfirmDialog } from '@jornadas/ui';
import { SECTIONS, buildSectionSchema, type SectionKey } from '@/lib/content';
import { FieldRenderer } from './FieldRenderer';
import { SectionPreview } from './SectionPreview';

/** El editor es genérico: trabaja con el JSON de la sección, validado por su schema. */
export type SectionFormValues = Record<string, unknown>;

interface Props {
  sectionKey: SectionKey;
  initialData: SectionFormValues;
  updatedAt: string | null;
  isCustomized: boolean;
}

const cardSx = {
  p: { xs: 2.5, md: 3.5 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
};

const fmtDate = (iso: string) => format(new Date(iso), "d 'de' MMMM yyyy, HH:mm", { locale: es });

export function SectionEditor({ sectionKey, initialData, updatedAt, isCustomized }: Props) {
  const router = useRouter();
  const def = SECTIONS[sectionKey];
  const schema = useMemo(() => buildSectionSchema(def.fields), [def.fields]);

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
    mode: 'onTouched',
  });
  const { handleSubmit, watch, reset, formState: { isSubmitting, isDirty } } = form;
  const values = watch();

  const [meta, setMeta] = useState({ updatedAt, isCustomized });
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const onSubmit = async (data: SectionFormValues) => {
    const toastId = toast.loading('Guardando...');
    try {
      const res = await fetch(`/api/content/${sectionKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: { formErrors?: string[] } | string } | null;
        const msg = typeof json?.error === 'string' ? json.error : json?.error?.formErrors?.[0];
        toast.error(msg ?? 'No se pudo guardar. Revisá los campos.', { id: toastId });
        return;
      }
      const json = (await res.json()) as { data: SectionFormValues; updatedAt: string };
      reset(json.data);
      setMeta({ updatedAt: json.updatedAt, isCustomized: true });
      toast.success('Guardado. El sitio ya muestra los cambios.', { id: toastId });
      router.refresh();
    } catch {
      toast.error('Error de conexión', { id: toastId });
    }
  };

  const onError = () => {
    toast.error('Hay campos con errores. Revisá los marcados en rojo.');
  };

  const handleReset = async () => {
    setResetting(true);
    const toastId = toast.loading('Restaurando...');
    try {
      const res = await fetch(`/api/content/${sectionKey}`, { method: 'DELETE' });
      if (!res.ok) {
        toast.error('No se pudo restaurar', { id: toastId });
        return;
      }
      reset(def.defaults as unknown as SectionFormValues);
      setMeta({ updatedAt: null, isCustomized: false });
      toast.success('Textos originales restaurados', { id: toastId });
      router.refresh();
    } catch {
      toast.error('Error de conexión', { id: toastId });
    } finally {
      setResetting(false);
      setConfirmReset(false);
    }
  };

  return (
    <FormProvider {...form}>
      <Box component="form" onSubmit={(e) => e.preventDefault()} noValidate>
        <Grid container spacing={3} alignItems="flex-start">
          {/* ── Formulario ─────────────────────────────────────────────── */}
          <Grid item xs={12} lg={7}>
            <Box data-tour="contentEditor.form" sx={cardSx}>
              {def.fields.map((field) => (
                <FieldRenderer key={field.key} field={field} />
              ))}
            </Box>
          </Grid>

          {/* ── Vista previa + metadata ────────────────────────────────── */}
          <Grid item xs={12} lg={5}>
            <Box sx={{ position: { lg: 'sticky' }, top: 16 }}>
              <Box data-tour="contentEditor.preview">
                <SectionPreview sectionKey={sectionKey} values={values} />
              </Box>

              <Box
                sx={{
                  mt: 2, p: 2, borderRadius: 2,
                  border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper',
                  display: 'flex', flexDirection: 'column', gap: 1,
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <History size={15} style={{ opacity: 0.6, flexShrink: 0 }} />
                  <Typography variant="caption" color="text.secondary">
                    {meta.updatedAt
                      ? `Última edición: ${fmtDate(meta.updatedAt)}`
                      : 'Esta sección todavía usa los textos originales del sitio.'}
                  </Typography>
                </Box>
                <Button
                  component="a"
                  href={def.siteUrl}
                  target="_blank"
                  rel="noopener"
                  size="small"
                  endIcon={<ExternalLink size={13} />}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Ver esta parte en el sitio
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Aire para que la barra fija no tape el final del formulario */}
        <Box sx={{ pb: 12 }} />

        {/* ── Barra fija de acciones ───────────────────────────────────── */}
        <Box
          data-tour="contentEditor.actions"
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 'var(--sidebar-width, 260px)',
            right: 0,
            zIndex: 1200,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 -8px 32px rgba(0,0,0,0.22)',
            transition: 'left 0.3s ease',
          }}
        >
          <Box sx={{ px: { xs: 2, md: 4 }, py: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              startIcon={<RotateCcw size={15} />}
              onClick={() => setConfirmReset(true)}
              disabled={isSubmitting || resetting || (!meta.isCustomized && !isDirty)}
            >
              Restaurar original
            </Button>

            <Box flex={1} minWidth={0}>
              {isDirty && (
                <Chip size="small" color="warning" variant="outlined" label="Tenés cambios sin guardar" />
              )}
            </Box>

            <Button
              type="button"
              variant="contained"
              size="large"
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <Save size={16} />}
              disabled={isSubmitting || resetting}
              onClick={() => void handleSubmit(onSubmit, onError)()}
              sx={{ px: 4 }}
            >
              Guardar cambios
            </Button>
          </Box>
        </Box>

        <ConfirmDialog
          open={confirmReset}
          title="Restaurar textos originales"
          description="Se van a reemplazar los textos y fotos de esta sección por los originales con los que se lanzó el sitio. El cambio se publica al instante."
          confirmLabel="Restaurar"
          onConfirm={handleReset}
          onCancel={() => setConfirmReset(false)}
          loading={resetting}
        />
      </Box>
    </FormProvider>
  );
}
