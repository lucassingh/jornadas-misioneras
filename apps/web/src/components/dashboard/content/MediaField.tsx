'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CloudinaryUpload } from '../events/CloudinaryUpload';
// ── Opción "pegar un link" (desactivada por ahora, 2026-10) ──────────────────
// Para volver a habilitarla: descomentar estos imports y el bloque marcado
// "LINK OPTION" más abajo. El schema (`lib/content/schema.ts`) ya acepta links
// https:// o rutas del sitio, así que no hace falta tocar la validación.
// import { useEffect, useState } from 'react';
// import Button from '@mui/material/Button';
// import Collapse from '@mui/material/Collapse';
// import TextField from '@mui/material/TextField';
// import { Link2 } from 'lucide-react';

interface Props {
  kind: 'image' | 'video';
  label: string;
  help?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** Si es opcional se puede "Quitar"; si no, solo reemplazar. */
  optional?: boolean;
}

/**
 * Imagen o video del CMS. El único camino hoy es SUBIR un archivo (Cloudinary,
 * carpeta `site`): con un archivo cargado se reemplaza con "Cambiar imagen /
 * Cambiar video". La opción de pegar un link quedó comentada (ver abajo) para
 * no confundir con rutas técnicas; el campo sigue guardando una URL.
 */
export function MediaField({ kind, label, help, value, onChange, error, optional = false }: Props) {
  const isImage = kind === 'image';
  const noun = isImage ? 'imagen' : 'video';

  // LINK OPTION — estado del campo de link (desactivado)
  // const [showLink, setShowLink] = useState(false);
  // useEffect(() => {
  //   if (error) setShowLink(true);
  // }, [error]);

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} lineHeight={1.3}>
        {label}
      </Typography>
      {help && (
        <Typography variant="caption" color="text.secondary" display="block" mb={1.5} sx={{ lineHeight: 1.5 }}>
          {help}
        </Typography>
      )}

      <CloudinaryUpload
        label={value ? '' : `Subir ${isImage ? 'una imagen' : 'un video'}`}
        value={value || null}
        onChange={(url) => onChange(url ?? '')}
        folder="site"
        resourceType={kind}
        allowRemove={optional}
      />

      {/* Error de validación (ej. campo obligatorio vacío) — antes lo mostraba el campo de link */}
      {error && (
        <Typography variant="caption" color="error" display="block" mt={0.75} fontWeight={600}>
          {error}
        </Typography>
      )}

      {!value && !error && (
        <Typography variant="caption" color="text.disabled" display="block" mt={0.75}>
          Todavía no hay {noun} cargad{isImage ? 'a' : 'o'}.
        </Typography>
      )}

      {/* LINK OPTION — campo secundario para pegar un link (desactivado)
      <Box sx={{ mt: 2 }}>
        <Button
          type="button"
          size="small"
          variant="text"
          color="inherit"
          startIcon={<Link2 size={14} />}
          onClick={() => setShowLink((v) => !v)}
          sx={{ color: 'text.secondary', fontWeight: 500, px: 1 }}
        >
          {showLink ? 'Ocultar el link' : `Usar un link en vez de subir ${isImage ? 'una imagen' : 'un video'}`}
        </Button>

        <Collapse in={showLink}>
          <TextField
            size="small"
            fullWidth
            sx={{ mt: 1.5 }}
            label={`Link de ${isImage ? 'la imagen' : 'el video'}`}
            placeholder="https://..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            helperText={
              error ??
              `Pegá el link completo (empieza con https://). Sirve si ${isImage ? 'la imagen' : 'el video'} ya está publicad${isImage ? 'a' : 'o'} en otro lado. Si subís un archivo, se completa solo.`
            }
          />
        </Collapse>
      </Box>
      */}
    </Box>
  );
}
